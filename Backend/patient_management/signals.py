from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Visit, Session
from .services import analyze_long_term_progress

@receiver(post_save, sender=Visit)
def update_patient_long_term_analysis(sender, instance, created, **kwargs):
    """
    Signal handler do aktualizacji długoterminowej analizy pacjenta po dodaniu lub aktualizacji wizyty.
    """
    patient = instance.patient
    if not patient:
        return

    # Pobierz wszystkie wizyty i sesje dla pacjenta
    visits = Visit.objects.filter(patient=patient).order_by('visit_date')
    visits_data = []
    
    for visit in visits:
        # Pobierz wszystkie sesje dla tej wizyty
        sessions = Session.objects.filter(visit=visit).order_by('created_at')
        sessions_data = []
        
        for session in sessions:
            session_data = {
                'created_at': session.created_at,
                'timeline_data': session.timeline_data,
                'stress_percentage': session.stress_percentage,
                'meditation_percentage': session.meditation_percentage,
                'amusement_percentage': session.amusement_percentage,
                'ai_summary_story': session.ai_summary_story
            }
            sessions_data.append(session_data)
        
        visit_data = {
            'date': visit.visit_date,
            'psychologist_notes': visit.psychologist_notes,
            'ai_summary': visit.ai_summary,
            'sessions': sessions_data
        }
        visits_data.append(visit_data)
    
    # Wykonaj analizę długoterminową
    try:
        long_term_analysis = analyze_long_term_progress(visits_data)
        patient.long_term_summary = long_term_analysis
        patient.save(update_fields=['long_term_summary'])
    except Exception as e:
        print(f"Błąd podczas generowania długoterminowej analizy pacjenta: {str(e)}")