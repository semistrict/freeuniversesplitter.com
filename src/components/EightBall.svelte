<script lang="ts">
    import { getRandom } from "../random";

    import { Canvas, Layer } from "svelte-canvas";

    export let width = 256
    export let height = 256

    export let selected = -1

    const OPTIONS = [
        'It is certain',
        'It is decidedly so',
        'Without a doubt',
        'Yes, definitely',
        'You may rely on it',
        'As I see it, yes',
        'Most likely',
        'Outlook good',
        'Yes',
        'Signs point to yes',

        'Reply hazy, try again',
        'Ask again later',
        'Better not tell you now',
        'Cannot predict now',
        'Concentrateand ask again',

        "Don't count on it",
        "My reply is no",
        "My sources say no",
        "Outlook not so good",
        "Very doubtful"
    ]

    $: render = ({context, width, height}) => {
        let ctx = context
        if (ctx == null) {
            alert("Canvas 2d not supported!")
            return
        }
        const outerRadius = width / 2
        const innerRadius = outerRadius / 1.7

        ctx.save()

        ctx.beginPath()
        ctx.arc(width / 2, height / 2, outerRadius, 0, 2 * Math.PI)
        ctx.fillStyle = '#222222'
        ctx.fill()
        ctx.stroke()

        ctx.restore()

        ctx.beginPath()
        ctx.arc(width / 2, height / 2, innerRadius, 0, 2 * Math.PI)
        ctx.fillStyle = '#000'
        ctx.fill()
        ctx.stroke()

        let selectedText = 'Click me'
        if (selected >= 0) {
            selectedText = OPTIONS[selected % OPTIONS.length]
        }

        ctx.restore()
        ctx.fillStyle = '#00aaff'
        ctx.font = '16px serif'
        ctx.textAlign = 'center'
        ctx.fillText(selectedText + ".", width / 2, height / 2)
    }

    async function onClicked() {
        let {randomNum} = await getRandom()
        selected = randomNum
    }
</script>
<div>
    <p>Focus on your question and tap the 8 ball...</p>
<Canvas width={width} height={height} on:click={onClicked}>
    <Layer {render}/>
</Canvas>
</div>