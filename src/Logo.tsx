import React from 'react';

interface LogoProps {
    onClick: () => void;
    logoUrl: string;
    style: React.CSSProperties;
}

const Logo: React.FC<LogoProps> = ({ onClick, logoUrl, style }) => {
    return (
        <img
            src={logoUrl}
            style={style}
            onClick={onClick}
            alt="Translate"
            className="position-absolute"
        />
    );
};

export default Logo;
