import React from 'react';

export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
<svg {...props} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(0 -5)">
    <path d="M 25 65 C 10 90, 10 140, 25 165 L 20 160 C 5 135, 5 85, 20 60 Z" fill="#B58A3F"/>
    <path d="M 175 65 C 190 90, 190 140, 175 165 L 180 160 C 195 135, 195 85, 180 60 Z" fill="#B58A3F"/>
    
    <path d="M 30 60 C 30 50, 40 40, 50 40 L 150 40 C 160 40, 170 50, 170 60 L 170 65 A 10 10 0 0 1 175 65 C 180 75, 180 85, 175 95 L 170 95 L 170 160 C 170 170, 100 195, 100 195 C 100 195, 30 170, 30 160 L 30 95 L 25 95 C 20 85, 20 75, 25 65 A 10 10 0 0 1 30 65 Z" fill="#E98A3B"/>
    <path d="M 100 65 L 100 195 C 100 195, 170 170, 170 160 L 170 65 Z" fill="#C14430"/>
    <rect x="40" y="45" width="120" height="20" fill="#B58A3F"/>

    <circle cx="100" cy="130" r="10" fill="#B58A3F" stroke="#FDEBCF" strokeWidth="1"/>
    <text x="100" y="134" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">2</text>
    
    <text x="100" y="59" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">CRADLE</text>

    <path d="M 40 175 C 60 190, 140 190, 160 175 L 155 180 C 140 195, 60 195, 45 180 Z" fill="#FFFFFF"/>
    <path d="M 40 175 C 60 190, 140 190, 160 175 L 158 172 C 140 185, 60 185, 42 172 Z" fill="#F0F0F0"/>

    <text x="100" y="186" textAnchor="middle" fill="#333" fontSize="16" fontWeight="bold" fontFamily="serif">HARVARD</text>

    <g fill="#B58A3F">
        <circle cx="28" cy="58" r="1.5"/>
        <circle cx="172" cy="58" r="1.5"/>
        <circle cx="20" cy="110" r="1.5"/>
        <circle cx="180" cy="110" r="1.5"/>
    </g>

    <g fill="none" stroke="#333" strokeWidth="1.5">
        <path d="M 65 95 C 60 90, 55 90, 50 95 C 55 100, 60 100, 65 95 M 58 85 C 55 83, 52 85, 50 88 M 70 88 C 73 85, 75 83, 72 85"/>
        <path d="M 125 90 H 145 V 105 H 125 Z M 135 90 V 105 M 125 93 H 145 M 125 102 H 145" stroke="#fff" strokeWidth="1"/>
        <path d="M 55 150 L 60 140 L 65 150 L 60 148 Z M 58 140 L 62 140" stroke="#C14430" strokeWidth="1.5"/>
        <path d="M 145 145 L 125 145 L 135 155 Z M 135 155 V 160 M 132 160 H 138" stroke="black" strokeWidth="1.5"/>
    </g>
    </g>
</svg>
);
