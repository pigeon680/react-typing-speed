/* eslint-disable no-undef */
// SpeedTypingGame.js

import React, {
    useState,
    useEffect
} from 'react';
import './SpeedTypingGame.css';
import TypingArea from './TypingArea'; // Import the TypingArea component


const SpeedTypingGame = () => {
    const paragraphs = [
        "A plant is one of the most important living things that develop on the earth and is made up of stems, leaves, roots, and so on.Parts of Plants: The part of the plant that developed beneath the soil is referred to as root and the part that grows outside of the soil is known as shoot.The shoot consists of stems, branches, leaves, fruits, and flowers.Plants are made up of six main parts: roots, stems,leaves, flowers, fruits, and seeds.",
        "The root is the part of the plant that grows in the soil. The primary root emerges from the embryo.Its primary function is to provide the plant stability in the earth and make other mineral salts from the earth available to the plant for various metabolic processes There are three types of roots i.e.Tap Root",
    ];
    // const [time, setTime] = useState(0);
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setTime((prevTime) => prevTime + 1);
    //     }, 1000);

    //     return () => clearInterval(interval);
    // }, []);
    // return <h1>{time} seconds passed</h1>;

    const [typingText, setTypingText] = useState('');
    const [inpFieldValue, setInpFieldValue] = useState('');
    const maxTime = 60;
    const [timeLeft, setTimeLeft] = useState(maxTime);
    const [charIndex, setCharIndex] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [WPM, setWPM] = useState(0);
    const [CPM, setCPM] = useState(0);

    const loadParagraph = () => {
        const ranIndex = Math.floor(Math.random() * paragraphs.length);
        const inputField = document.getElementsByClassName('input-field')[0];
        document.addEventListener("keydown", () => inputField.focus());
        const content = Array.from(paragraphs[ranIndex]).map((letter, index) => ( 
            <span key = {index}
            style = {{color: (letter !== ' ') ? 'black' : 'transparent'}}
            className = {`char ${index === 0 ? 'active' : ''}`} > {(letter !== ' ') ? letter : '_'} 
            </span>
        ));
        setTypingText(content);
        setInpFieldValue('');
        setCharIndex(0);
        setMistakes(0);
        setIsTyping(false);
    };
    const handleKeyDown = (event) => {
        const characters = document.querySelectorAll('.char');
        if (event.key === 'Backspace' && charIndex > 0 &&
            charIndex < characters.length && timeLeft > 0) {
            if (characters[charIndex - 1].classList.contains('correct')) {
                characters[charIndex - 1].classList.remove('correct');
            }
            if (characters[charIndex - 1].classList.contains('wrong')) {
                characters[charIndex - 1].classList.remove('wrong');
                setMistakes(mistakes - 1);
            }
            characters[charIndex].classList.remove('active');
            characters[charIndex - 1].classList.add('active');
            setCharIndex(charIndex - 1);
            let cpm = (charIndex - mistakes - 1) * (60 / (maxTime - timeLeft));
            cpm = cpm < 0 || !cpm || cpm === Infinity ? 0 : cpm;
            setCPM(parseInt(cpm, 10));
            let wpm = Math.round(((charIndex - mistakes) / 5) / (
            maxTime - timeLeft) * 60);
            wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
            setWPM(wpm);
        }
    }

    const initTyping = (event) => {
        const characters = document.querySelectorAll('.char');
        let typedChar = event.target.value;
        if (charIndex < characters.length && timeLeft > 0) {
            let currentChar = characters[charIndex].innerText;
            if (currentChar === '_') currentChar = ' ';
            if (!isTyping) {
                setIsTyping(true);
            }
            if (typedChar === currentChar) {
                setCharIndex(charIndex + 1);
                if (charIndex + 1 < characters.length) characters[charIndex +
                    1].classList.add('active');
                characters[charIndex].classList.remove('active');
                characters[charIndex].classList.add('correct');
            } else {
                setCharIndex(charIndex + 1);
                setMistakes(mistakes + 1);
                characters[charIndex].classList.remove('active');
                if (charIndex + 1 < characters.length) characters[charIndex +
                    1].classList.add('active');
                characters[charIndex].classList.add('wrong');
            }

            if (charIndex === characters.length - 1) setIsTyping(false);

            let wpm = Math.round(((charIndex - mistakes) / 5) / (
                maxTime - timeLeft) * 60);
            wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
            setWPM(wpm);

            let cpm = (charIndex - mistakes) * (60 / (maxTime - timeLeft));
            cpm = cpm < 0 || !cpm || cpm === Infinity ? 0 : cpm;
            setCPM(parseInt(cpm, 10));
        } else {
            setIsTyping(false);
        }
    };

    const resetGame = () => {
        setIsTyping(false);
        setTimeLeft(maxTime);
        setCharIndex(0);
        setMistakes(0);
        setTypingText('');
        setCPM(0);
        setWPM(0);
        const characters = document.querySelectorAll('.char');
        characters.forEach(span => {
            span.classList.remove("correct");
            span.classList.remove('wrong');
            span.classList.remove('active');
        });
        characters[0].classList.add('active');
        loadParagraph();
    };

    useEffect(() => {
        loadParagraph();
    }, []);

    useEffect(() => {
        let interval;
        if (isTyping && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft - 1);
                let cpm = (charIndex - mistakes) * (60 / (maxTime - timeLeft));
                cpm = cpm < 0 || !cpm || cpm === Infinity ? 0 : cpm;
                setCPM(parseInt(cpm, 10));
                let wpm = Math.round(((charIndex - mistakes) / 5) / (
                    maxTime - timeLeft) * 60);
                wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
                setWPM(wpm);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(interval);
            setIsTyping(false);
        }
        return () => {
            clearInterval(interval);
        };
    }, [isTyping, timeLeft]);


    return ( 
        <div className = "container" >
            <input type = "text"
            className = "input-field"
            value = {inpFieldValue}
            onChange = {initTyping}
            onKeyDown = {handleKeyDown}/> 
            {} 
            <TypingArea typingText = {typingText}
            inpFieldValue = {inpFieldValue}
            timeLeft = {timeLeft}
            mistakes = {mistakes}
            WPM = {WPM}
            CPM = {CPM}
            initTyping = {initTyping}
            handleKeyDown = {handleKeyDown}
            resetGame = {resetGame}/> 
        </div>
    );
};

export default SpeedTypingGame;