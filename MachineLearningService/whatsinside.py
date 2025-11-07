import numpy as np
import sys

def wyswietl_cale_dane_npz(nazwa_pliku):
    """
    Wczytuje plik .npz i wyświetla pełną zawartość wszystkich tablic NumPy.
    
    :param nazwa_pliku: Ścieżka do pliku .npz.
    """
    try:
        # Ustawienie opcji drukowania, aby pokazać wszystkie elementy
        # (bez skracania ... dla dużych tablic)
        np.set_printoptions(threshold=sys.maxsize, linewidth=200)

        with np.load(nazwa_pliku) as data:
            print(f"✅ Pomyślnie wczytano plik: {nazwa_pliku}")
            
            nazwy_tablic = data.files
            
            if not nazwy_tablic:
                print("⚠️ Plik .npz nie zawiera żadnych tablic NumPy.")
                return

            print("\n📌 PEŁNA ZAWARTOŚĆ PLIKU .npz:")
            
            for nazwa in nazwy_tablic:
                tablica = data[nazwa]
                
                print("\n" + "=" * 60)
                print(f"**Tablica:** **{nazwa}**")
                print(f"Kształt: {tablica.shape}, Typ: {tablica.dtype}")
                print("=" * 60)
                
                # Wydruk pełnej zawartości tablicy
                print(tablica)
                
            # Przywrócenie domyślnych opcji drukowania (opcjonalnie)
            np.set_printoptions(threshold=1000, linewidth=75) 

    except FileNotFoundError:
        print(f"❌ Błąd: Plik '{nazwa_pliku}' nie został znaleziony.")
    except Exception as e:
        print(f"❌ Wystąpił błąd podczas wczytywania pliku: {e}")

# --- Użycie programu ---

nazwa_twojego_pliku = "final_pytorch_S2.npz" 
wyswietl_cale_dane_npz(nazwa_twojego_pliku)