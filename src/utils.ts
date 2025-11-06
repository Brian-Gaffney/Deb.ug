export function getFadeParams(order: number) {
    return {
        duration: 250,
        delay: order * 100
    }
}