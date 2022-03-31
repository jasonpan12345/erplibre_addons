  const CFG = JSON.parse(document.querySelector('script#config').textContent);

  const domain = 'meet.jit.si';
  const options = {
    roomName: CFG.roomName, // 'PickAnAppropriateMeetingNameHere',
    width: '100%', // 700,
    height: 700,
    parentNode: document.querySelector('#meet'),
    userInfo: CFG.userInfo,

    invitees_X: [ /* {
      email: 'nick.freear@open.ac.uk',
      name: 'Nick 2'
    } */ ],

    onload: ev => {
      const URL = ev.target.src;

      console.warn('> Jitsi loaded:', URL, ev);

      document.body.classList.add('jitsi-loaded');
    }
  };

  const jitsi = new JitsiMeetExternalAPI(domain, options);

  jitsi.addEventListener('incomingMessage', ev => console.warn('> Incoming:', ev));
  jitsi.addEventListener('outgoingMessage', ev => console.warn('> Outgoing:', ev));
