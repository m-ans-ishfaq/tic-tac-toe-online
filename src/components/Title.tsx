export const Title = ({ text }: { text: string }) => {
    return (
        <div className="relative">
            <h1 className="relative z-10 font-bold text-2xl text-center uppercase">
                {text}
            </h1>
            <span
                className="absolute top-1 outlined font-bold opacity-25 text-zinc-950 text-2xl text-center uppercase outlined-text"
                data-text={text}
            >
                {text}
            </span>
        </div>
    )
}