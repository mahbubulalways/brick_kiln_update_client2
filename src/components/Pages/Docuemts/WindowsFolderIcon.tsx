export const WindowsFolderIcon = ({
    size = 64,
}: {
    size?: number;
}) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 48 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Main folder */}
            <path
                d="M7 6H25L31 13H41C42.1 13 43 13.9 43 15V54C43 55.1 42.1 56 41 56H7V6Z"
                fill="#FFD966"
            />

            {/* Main body */}
            <path
                d="M31 13H41C42.1 13 43 13.9 43 15V54C43 55.1 42.1 56 41 56H31V13Z"
                fill="#FFDD72"
            />

            {/* Tall front flap */}
            <path
                d="M7 6L25 18V64L7 54V6Z"
                fill="#FFE08A"
            />

            {/* Front highlight */}
            <path
                d="M7 6L25 18V61L7 51V6Z"
                fill="#FFE38F"
            />

            {/* Bottom shadow */}
            <path
                d="M25 64L43 56H41L25 61V64Z"
                fill="#E8C85B"
                opacity="0.3"
            />
        </svg>
    );
};