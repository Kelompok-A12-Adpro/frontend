export default function Loading() {
    return (
        <div className="w-full h-screen flex items-center justify-center bg-zinc-100">
            <style>
            {`
            @keyframes initial-loading {
                0% { transform: translate(-34px) }
                50% { transform: translate(96px) }
                to { transform: translate(-34px) }
            }
            `}
            </style>
            <div style={{
                width: '130px',
                height: '5px',
                margin: '0 auto',
                borderRadius: '2px',
                backgroundColor: '#fff',
                position: 'relative',
                overflow: 'hidden',
                zIndex: 1,
                transform: 'rotateY(0)',
                transition: 'transform .3s ease-in'
            }}>
                <div style={{
                    height: '100%',
                    width: '68px',
                    position: 'absolute',
                    transform: 'translate(-34px)',
                    backgroundColor: '#0a66c2',
                    borderRadius: '2px',
                    animation: 'initial-loading 1.5s ease infinite'
                }}/>
            </div>
        </div>
    );
}