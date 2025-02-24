import '../../../assets/solemn.mp3'

import ReactDOM from 'react-dom/client'


const playDefaultSound = (sound: string) => {
    console.log(sound)
    const a = new Audio(sound)
    a.volume = 1
    a.play()
}

chrome.runtime.onMessage.addListener((msg: any) => {
    if (msg.cmd == 'play-sound')
        playDefaultSound(msg.sound)
});

const container = document.createElement('div')
document.body.appendChild(container)

const root = ReactDOM.createRoot(container)
root.render(<div />)
