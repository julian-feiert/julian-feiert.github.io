function createAndDownloadEvent(summary, description, location, startDate, endDate, fileName) {
  const event = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    'SUMMARY:' + summary,
    'DESCRIPTION:' + description,
    'LOCATION:' + location,
    'DTSTART:' + startDate, // Adjust date and time as necessary
    'DTEND:' + endDate,     // Adjust date and time as necessary
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([event], {type: 'text/calendar;charset=utf-8'});
  const url = URL.createObjectURL(blob);

  // Create a temporary anchor to trigger the download
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor); // Required for Firefox
  anchor.click();
  // Cleanup
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

document.getElementById('downloadICSparty').addEventListener('click', function() {
  createAndDownloadEvent(
    'Julian feiert mit dir!',
    'Celebration of many awesome people!',
    'Kinzig 9',
    '20240601T180000Z', // Adjust date and time as necessary
    '20240602T040000Z', // Adjust date and time as necessary
    'Julians-Party.ics'
  );
});

document.getElementById('downloadICSdemo').addEventListener('click', function() {
  createAndDownloadEvent(
    'Mietenwahnsinn Demo!',
    'Demonstration gegen Mietenwahnsinn, Verdrängung und Wohnungsnot!',
    'Potsdamer Platz',
    '20240601T140000Z', // Adjust date and time as necessary
    '20240601T111800Z', // Adjust date and time as necessary
    'Mietenwahnsinn-demo.ics'
  );
});

document.getElementById('downloadICSreminder').addEventListener('click', function() {
  createAndDownloadEvent(
    'Checke mal das update zur Party!',
    'https://julian-feiert.github.io/',
    'None',
    '20240525T120000Z', // Adjust date and time as necessary
    '20240525T120500Z', // Adjust date and time as necessary
    'Reminder_party.ics'
  );
});
