export default function keyIsSpaceOrEnter(event){
    if (event.code === 'Space' || event.code === 'Enter' || event.keyCode === 32 || event.keyCode === 13) {
        return true
    }
    return false
}