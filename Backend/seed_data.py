import os
import django
from datetime import date, timedelta
from django.utils import timezone
import random
from faker import Faker

# --- WAŻNE: Ustawienie środowiska Django ---
# Zmień 'nazwa_twojego_projektu.settings' na ścieżkę do Twojego pliku settings.py
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api.settings')
django.setup()

# --- Import Twoich Modeli ---
from patient_management.models import Patient, Visit # Zmień na faktyczną nazwę Twojej aplikacji!

# Konfiguracja Faker
fake = Faker('pl_PL')

# Stałe definiujące ilość danych
NUM_PATIENTS = 5
MIN_VISITS = 2
MAX_VISITS = 3
MIN_STRESS_ENTRIES = 15
MAX_STRESS_ENTRIES = 40

def generate_stress_history(visit_date):
    """Generuje losową tablicę historii stresu dla pola JSONField z dużą liczbą wpisów."""
    history = []
    num_entries = random.randint(MIN_STRESS_ENTRIES, MAX_STRESS_ENTRIES)
    
    # Generowanie wpisów z timestampami z 7 dni przed wizytą
    for _ in range(num_entries):
        # Odejmij losową ilość czasu do 7 dni wstecz
        entry_time = visit_date - timedelta(days=random.uniform(0, 7), hours=random.uniform(0, 24))
        
        history.append({
            "timestamp": entry_time.isoformat(),
            "stress_level": random.randint(1, 10)  # Poziom stresu 1-10
        })
    
    # Sortowanie wpisów chronologicznie
    history.sort(key=lambda x: x['timestamp'])
    return history


def run_seed():
    """Główna funkcja do dodawania losowych danych."""
    print(f"--- Rozpoczynam dodawanie {NUM_PATIENTS} pacjentów z {MIN_VISITS}-{MAX_VISITS} wizytami ---")
    
    Patient.objects.all().delete() # Opcjonalnie: usuń wszystkie stare dane przed startem
    Visit.objects.all().delete() # Opcjonalnie: usuń wszystkie stare dane przed startem

    for i in range(NUM_PATIENTS):
        # 1. Tworzenie losowego pacjenta
        gender_choice = random.choice(['M', 'F'])
        first_name = fake.first_name_male() if gender_choice == 'M' else fake.first_name_female()
        
        # Tworzymy unikalny PESEL
        pesel_base = str(random.randint(40, 99)) + str(random.randint(10, 12)) + str(random.randint(10, 31))
        pesel = pesel_base + str(random.randint(10000, 99999))
        
        try:
            patient = Patient.objects.create(
                first_name=first_name,
                last_name=fake.last_name(),
                dob=fake.date_of_birth(minimum_age=18, maximum_age=85),
                gender=gender_choice,
                pesel=pesel,
                notes=fake.paragraph(nb_sentences=2, variable_nb_sentences=True)
            )
            print(f"✅ Utworzono Pacjenta {i+1}/{NUM_PATIENTS}: {patient.first_name} {patient.last_name}")
            
        except Exception as e:
            print(f"❌ Błąd przy tworzeniu pacjenta: {e}")
            continue

        # 2. Tworzenie wizyt dla pacjenta
        num_visits = random.randint(MIN_VISITS, MAX_VISITS)
        
        for v in range(num_visits):
            # Ustawienie daty wizyty na losowy dzień z ostatnich 365 dni
            visit_date = timezone.now() - timedelta(days=random.randint(1, 365), hours=random.randint(0, 23))
            
            # Generowanie struktury dla pola JSONField z dużą ilością danych
            stress_data = generate_stress_history(visit_date)
            
            try:
                Visit.objects.create(
                    patient=patient,
                    visit_date=visit_date,
                    stress_history=stress_data,
                    psychologist_notes=fake.text(max_nb_chars=500),
                    ai_summary=fake.text(max_nb_chars=200)
                )
                print(f"   -> Dodano wizytę {v+1}/{num_visits} z {len(stress_data)} wpisami stresu.")
            
            except Exception as e:
                print(f"   ❌ Błąd przy tworzeniu wizyty: {e}")

    print("\n*** Pomyślnie zakończono dodawanie danych! ***")


if __name__ == '__main__':
    run_seed()