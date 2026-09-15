import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

type Props = {
  size?: number;
};

export default function PocketFilezLogo({ size = 120 }: Props) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      accessibilityLabel="Ikon PocketFilez"
    >
      <Defs>
        <LinearGradient id="pfIcon" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#0b1220" />
          <Stop offset="0.5" stopColor="#1d4ed8" />
          <Stop offset="1" stopColor="#60a5fa" />
        </LinearGradient>
        <LinearGradient id="pfPocket" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#ffffff" />
          <Stop offset="1" stopColor="#c7ddff" />
        </LinearGradient>
        <LinearGradient id="pfDoc" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#1d4ed8" />
          <Stop offset="1" stopColor="#0b1220" />
        </LinearGradient>
      </Defs>

      <Rect x="32" y="32" width="448" height="448" rx="104" fill="url(#pfIcon)" />

      <Path
        d="M136 32 h240 a104 104 0 0 1 104 104 v24 C420 104 300 76 136 120 z"
        fill="#ffffff"
        opacity="0.10"
      />

      <Path
        d="M112 268 h288 v92 a96 96 0 0 1 -96 96 h-96 a96 96 0 0 1 -96 -96 z"
        fill="url(#pfPocket)"
      />

      <Rect x="196" y="150" width="120" height="150" rx="18" fill="url(#pfDoc)" />

      <Path
        d="M226 214 h60 M226 244 h48 M226 274 h34"
        stroke="#ffffff"
        strokeWidth="12"
        strokeLinecap="round"
        opacity="0.85"
      />

      <Path d="M286 150 h30 v30 z" fill="#93c5fd" />
    </Svg>
  );
}