<x-mail::message>
# Bedankt voor uw bericht

Beste {{ $submission->name }},

Bedankt voor uw bericht. Wij hebben uw aanvraag in goede orde ontvangen en nemen zo snel mogelijk contact met u op.

---

**Uw bericht:**

**Onderwerp:** {{ $submission->subject }}

{{ $submission->message }}

---

Heeft u in de tussentijd vragen? Neem gerust contact met ons op.

Met vriendelijke groet,<br>
{{ config('app.name') }}
</x-mail::message>
