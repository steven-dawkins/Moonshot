import khanText from "../assets/texts/khan.txt";

const texts = khanText.split("\n");

export function getRandomText() {
    return texts[Math.floor(Math.random() * texts.length)];;
}