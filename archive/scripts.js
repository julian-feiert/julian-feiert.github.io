  document.getElementById('downloadICSparty').addEventListener('click', function() {
    const event = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      'SUMMARY:Julian feiert mit dir!',
      'DESCRIPTION:Celebration of many awesome people!',
      'LOCATION:Kinzig 9',
      'DTSTART:20240601T180000Z', // Adjust date and time as necessary
      'DTEND:20240602T040000Z',   // Adjust date and time as necessary
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([event], {type: 'text/calendar;charset=utf-8'});
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor to trigger the download
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'Julians-Party.ics';
    document.body.appendChild(anchor); // Required for Firefox
    anchor.click();
    // Cleanup
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  });

  document.getElementById('downloadICSdemo').addEventListener('click', function() {
    const event = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      'SUMMARY:Mietenwahnsinn Demo!',
      'DESCRIPTION:Demonstration gegen Mietenwahnsinn, Verdrängung und Wohnungsnot!',
      'LOCATION:Potsdamer Platz',
      'DTSTART:20240601T140000Z', // Adjust date and time as necessary
      'DTEND:20240601T111800Z',   // Adjust date and time as necessary
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([event], {type: 'text/calendar;charset=utf-8'});
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor to trigger the download
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'Mietenwahnsinn-demo.ics';
    document.body.appendChild(anchor); // Required for Firefox
    anchor.click();
    // Cleanup
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  });

