from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from drf_spectacular.utils import extend_schema, OpenApiExample
from .serializers import StressClassificationRequestSerializer
from .ml_service import StressClassificationService
from .data_simulator import generate_simulated_data
import numpy as np
from datetime import datetime
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

# Singleton instance serwisu
_stress_service = None

def get_stress_service():
    """Zwraca singleton instance serwisu klasyfikacji."""
    global _stress_service
    if _stress_service is None:
        _stress_service = StressClassificationService()
        try:
            _stress_service.load_model()
            logger.info("Model klasyfikacji stresu załadowany pomyślnie")
        except Exception as e:
            logger.error(f"Błąd podczas ładowania modelu: {e}")
            raise
    return _stress_service


class StressClassificationView(APIView):
    """
    Endpoint do klasyfikacji poziomu stresu na podstawie sygnałów biometrycznych.
    
    Akceptuje dane z czujników (ACC, BVP, EDA, TEMP) lub używa symulowanych danych.
    Zwraca szczegółową analizę stresu w formacie JSON.
    """
    permission_classes = [AllowAny]  # Można zmienić na IsAuthenticated jeśli potrzeba
    
    @extend_schema(
        summary="Klasyfikacja stresu",
        description="""
        Analizuje sygnały biometryczne i zwraca szczegółową klasyfikację poziomu stresu.
        
        Możesz:
        - Wysłać rzeczywiste dane z czujników (acc, bvp, eda, temp)
        - Użyć symulowanych danych (use_simulation=true, domyślnie)
        
        Zwraca JSON z:
        - Metadata: informacje o analizie
        - Summary: podsumowanie poziomu stresu
        - Statistics: statystyki rozkładu klas
        - Segments: lista wszystkich segmentów czasowych z predykcjami
        - Stress moments: lista momentów wykrytego stresu
        """,
        request=StressClassificationRequestSerializer,
        responses={
            200: {
                'description': 'Sukces - zwraca analizę stresu w formacie JSON',
                'examples': {
                    'application/json': {
                        'metadata': {
                            'analysis_date': '2025-11-07T22:22:27.764764',
                            'start_timestamp': '2025-11-07T22:22:27.761766',
                            'total_duration_seconds': 5210,
                            'num_segments': 521
                        },
                        'summary': {
                            'overall_stress_level': 'Niski',
                            'overall_stress_value': 1,
                            'stress_percentage': 22.07
                        },
                        'segments': [],
                        'stress_moments': []
                    }
                }
            },
            400: {'description': 'Błąd walidacji danych wejściowych'},
            500: {'description': 'Błąd serwera - problem z modelem lub przetwarzaniem'}
        },
        examples=[
            OpenApiExample(
                'Symulowane dane',
                value={
                    'use_simulation': True
                },
                request_only=True
            ),
            OpenApiExample(
                'Rzeczywiste dane',
                value={
                    'use_simulation': False,
                    'acc': [[0.1, 0.2, 0.3], [0.2, 0.3, 0.4]],
                    'bvp': [0.5, 0.6, 0.7],
                    'eda': [0.3, 0.4, 0.5],
                    'temp': [36.5, 36.6, 36.7],
                    'start_timestamp': '2025-11-07T10:00:00'
                },
                request_only=True
            )
        ]
    )
    def post(self, request):
        """
        POST /api/stress-classification/
        
        Klasyfikuje poziom stresu na podstawie sygnałów biometrycznych.
        """
        serializer = StressClassificationRequestSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                {'error': 'Błąd walidacji', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        validated_data = serializer.validated_data
        
        try:
            # Pobierz serwis klasyfikacji
            service = get_stress_service()
            
            # Określ czy użyć symulacji
            use_simulation = validated_data.get('use_simulation', True)
            
            # Sprawdź czy wszystkie dane są podane
            has_all_data = all([
                validated_data.get('acc'),
                validated_data.get('bvp'),
                validated_data.get('eda'),
                validated_data.get('temp')
            ])
            
            if use_simulation or not has_all_data:
                # Użyj symulowanych danych
                logger.info("Używanie symulowanych danych")
                acc, bvp, eda, temp = generate_simulated_data()
            else:
                # Użyj rzeczywistych danych
                logger.info("Używanie rzeczywistych danych z żądania")
                acc_data = validated_data.get('acc', [])
                bvp_data = validated_data.get('bvp', [])
                eda_data = validated_data.get('eda', [])
                temp_data = validated_data.get('temp', [])
                
                # Konwersja do numpy arrays
                acc = np.array(acc_data)
                bvp = np.array(bvp_data)
                eda = np.array(eda_data)
                temp = np.array(temp_data)
                
                # Walidacja wymiarów
                if len(acc.shape) != 2 or acc.shape[1] != 3:
                    return Response(
                        {'error': 'ACC musi być tablicą 2D z 3 kolumnami (lista list [x, y, z])'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                if len(bvp.shape) != 1:
                    return Response(
                        {'error': 'BVP musi być tablicą 1D'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                if len(eda.shape) != 1:
                    return Response(
                        {'error': 'EDA musi być tablicą 1D'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                if len(temp.shape) != 1:
                    return Response(
                        {'error': 'TEMP musi być tablicą 1D'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Parsowanie timestampu
            start_timestamp = validated_data.get('start_timestamp')
            if start_timestamp:
                if isinstance(start_timestamp, str):
                    start_timestamp = datetime.fromisoformat(start_timestamp.replace('Z', '+00:00'))
            else:
                start_timestamp = datetime.now()
            
            # Wykonaj klasyfikację
            result = service.classify(acc, bvp, eda, temp, start_timestamp)
            
            return Response(result, status=status.HTTP_200_OK)
            
        except FileNotFoundError as e:
            logger.error(f"Nie znaleziono pliku: {e}")
            return Response(
                {'error': 'Model nie znaleziony', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except ValueError as e:
            logger.error(f"Błąd walidacji danych: {e}")
            return Response(
                {'error': 'Błąd walidacji danych', 'details': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Błąd podczas klasyfikacji: {e}", exc_info=True)
            return Response(
                {'error': 'Błąd podczas klasyfikacji', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class WESADDataView(APIView):
    """
    Endpoint zwracający dane z pliku processed_wesad_S10.npz w formacie odpowiednim do wykresów.
    """
    permission_classes = [AllowAny]
    
    @extend_schema(
        summary="Dane WESAD S10 do wykresów",
        description="""
        Zwraca dane z pliku processed_wesad_S10.npz w formacie odpowiednim do rysowania wykresów.
        
        Zwraca:
        - signals: dane sygnałów (ACC_x, ACC_y, ACC_z, BVP, EDA, TEMP) z czasem
        - labels: etykiety dla każdego segmentu
        - metadata: informacje o danych
        """,
        responses={
            200: {
                'description': 'Sukces - zwraca dane do wykresów',
                'examples': {
                    'application/json': {
                        'signals': {
                            'time': [0, 10, 20, ...],
                            'ACC_x': [[...], [...], ...],
                            'ACC_y': [[...], [...], ...],
                            'ACC_z': [[...], [...], ...],
                            'BVP': [[...], [...], ...],
                            'EDA': [[...], [...], ...],
                            'TEMP': [[...], [...], ...]
                        },
                        'labels': [1, 1, 2, ...],
                        'metadata': {
                            'num_segments': 547,
                            'segment_duration_seconds': 30,
                            'step_seconds': 10,
                            'sample_rate_hz': 4
                        }
                    }
                }
            },
            404: {'description': 'Plik nie znaleziony'},
            500: {'description': 'Błąd serwera'}
        }
    )
    def get(self, request):
        """
        GET /api/stress-classification/wesad-data/
        
        Zwraca dane z processed_wesad_S10.npz w formacie do wykresów.
        """
        try:
            # Ścieżka do pliku - względem katalogu projektu
            base_dir = Path(__file__).resolve().parent.parent.parent
            npz_file = base_dir / 'MachineLearningService' / 'processed_wesad_S10.npz'
            
            if not npz_file.exists():
                return Response(
                    {'error': f'Plik nie znaleziony: {npz_file}'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Ładowanie danych
            data = np.load(npz_file)
            X = data['X']  # (547, 120, 6)
            Y = data['Y']  # (547,)
            
            # Konfiguracja (zgodna z first_processing.py)
            TARGET_RATE = 4  # Hz
            WINDOW_SEC = 30  # sekundy
            STEP_SEC = 10    # sekundy
            
            # Przygotowanie danych do wykresów
            # Dla każdego segmentu tworzymy tablicę czasową
            num_segments = X.shape[0]
            segment_length = X.shape[1]  # 120 punktów
            
            # Czas dla każdego segmentu (w sekundach od początku segmentu)
            time_per_segment = np.linspace(0, WINDOW_SEC, segment_length).tolist()
            
            # Czas globalny (od początku nagrania)
            global_times = []
            for i in range(num_segments):
                segment_start_time = i * STEP_SEC
                segment_times = [segment_start_time + t for t in time_per_segment]
                global_times.extend(segment_times)
            
            # Przygotowanie sygnałów - każdy kanał jako lista wartości dla każdego segmentu
            signals = {
                'time': global_times,
                'ACC_x': [],
                'ACC_y': [],
                'ACC_z': [],
                'BVP': [],
                'EDA': [],
                'TEMP': []
            }
            
            # Mapowanie kanałów: X[:, :, 0]=ACC_x, 1=ACC_y, 2=ACC_z, 3=BVP, 4=EDA, 5=TEMP
            channel_names = ['ACC_x', 'ACC_y', 'ACC_z', 'BVP', 'EDA', 'TEMP']
            
            for segment_idx in range(num_segments):
                segment_data = X[segment_idx]  # (120, 6)
                
                for channel_idx, channel_name in enumerate(channel_names):
                    channel_values = segment_data[:, channel_idx].tolist()
                    signals[channel_name].extend(channel_values)
            
            # Etykiety z mapowaniem nazw
            LABEL_MAP = {
                0: 'transient/not_defined',
                1: 'baseline',
                2: 'stress',
                3: 'amusement',
                4: 'meditation'
            }
            
            labels_data = []
            for i, label_id in enumerate(Y):
                segment_start_time = i * STEP_SEC
                segment_end_time = segment_start_time + WINDOW_SEC
                labels_data.append({
                    'segment_index': int(i),
                    'label_id': int(label_id),
                    'label_name': LABEL_MAP.get(int(label_id), f'unknown_{int(label_id)}'),
                    'start_time_seconds': segment_start_time,
                    'end_time_seconds': segment_end_time,
                    'duration_seconds': WINDOW_SEC
                })
            
            # Statystyki etykiet
            unique_labels, counts = np.unique(Y, return_counts=True)
            label_statistics = []
            for label_id, count in zip(unique_labels, counts):
                label_statistics.append({
                    'label_id': int(label_id),
                    'label_name': LABEL_MAP.get(int(label_id), f'unknown_{int(label_id)}'),
                    'count': int(count),
                    'percentage': float((count / num_segments) * 100)
                })
            
            # Przygotowanie odpowiedzi
            response_data = {
                'signals': signals,
                'labels': labels_data,
                'label_statistics': label_statistics,
                'metadata': {
                    'num_segments': int(num_segments),
                    'segment_duration_seconds': WINDOW_SEC,
                    'step_seconds': STEP_SEC,
                    'sample_rate_hz': TARGET_RATE,
                    'points_per_segment': segment_length,
                    'total_duration_seconds': int(num_segments * STEP_SEC),
                    'total_points': len(global_times)
                }
            }
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        except FileNotFoundError as e:
            logger.error(f"Nie znaleziono pliku: {e}")
            return Response(
                {'error': 'Plik nie znaleziony', 'details': str(e)},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Błąd podczas ładowania danych: {e}", exc_info=True)
            return Response(
                {'error': 'Błąd podczas ładowania danych', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

