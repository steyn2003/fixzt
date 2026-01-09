<x-mail::message>
# Nieuw Contactformulier

Er is een nieuw bericht ontvangen via het contactformulier.

**Van:** {{ $submission->name }}

**E-mail:** {{ $submission->email }}

@if($submission->phone)
**Telefoon:** {{ $submission->phone }}
@endif

**Onderwerp:** {{ $submission->subject }}

---

**Bericht:**

{{ $submission->message }}

---

<x-mail::button :url="route('contacts.show', $submission)">
Bekijk in Dashboard
</x-mail::button>

Met vriendelijke groet,<br>
{{ config('app.name') }}
</x-mail::message>
