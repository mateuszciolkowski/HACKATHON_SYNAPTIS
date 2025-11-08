# Przykładowe pliki danych z bransoletki

W katalogu `public/` znajdują się przykładowe pliki JSON z danymi biometrycznymi z bransoletki Empatica E4.

## Dostępne pliki:

1. **sample_bracelet_data_low_stress.json** - Dane z niskim poziomem stresu (sesja relaksacyjna)
2. **sample_bracelet_data_high_stress.json** - Dane z wysokim poziomem stresu (okres zwiększonej aktywności)
3. **sample_bracelet_data_normal.json** - Dane z normalnym poziomem aktywności (stan bazowy)

## Format pliku:

Pliki JSON powinny mieć następującą strukturę:

```json
{
  "metadata": {
    "device": "Empatica E4",
    "recording_date": "2025-01-15T10:30:00Z",
    "duration_seconds": 300,
    "sampling_rates": {
      "ACC": 32,
      "BVP": 64,
      "EDA": 4,
      "TEMP": 4
    }
  },
  "signal": {
    "wrist": {
      "ACC": [[x, y, z], ...],  // Tablica 3-elementowych tablic (x, y, z)
      "BVP": [value, ...],       // Tablica wartości
      "EDA": [value, ...],       // Tablica wartości
      "TEMP": [value, ...]       // Tablica wartości
    }
  },
  "label": null,
  "note": "Opcjonalna notatka"
}
```

## Użycie:

1. Otwórz widok szczegółów pacjenta
2. Wybierz wizytę bez danych z bransoletki
3. Kliknij "Kliknij, aby wgrać dane z bransoletki"
4. Wybierz jeden z przykładowych plików JSON
5. System automatycznie sparsuje plik i wyświetli podsumowanie

## Częstotliwości próbkowania:

- **ACC (Akcelerometr)**: 32 Hz - 3 osie (x, y, z)
- **BVP (Blood Volume Pulse)**: 64 Hz
- **EDA (Electrodermal Activity)**: 4 Hz
- **TEMP (Temperatura)**: 4 Hz

## Uwagi:

- Przykładowe pliki zawierają tylko kilka próbek dla demonstracji
- W rzeczywistych plikach będzie znacznie więcej danych (np. 9600 próbek ACC dla 300 sekund)
- System automatycznie obliczy liczbę próbek na podstawie częstotliwości próbkowania i czasu trwania, jeśli dane nie są pełne

