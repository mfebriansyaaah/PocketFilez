import { Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import type { ComponentProps } from 'react';
import { Platform } from 'react-native';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: string | { pathname: string; params?: Record<string, string> } };

export function ExternalLink(props: Props) {
  return (
    <Link
      target="_blank"
      {...props}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      href={props.href as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onPress={(e: any) => {
        if (Platform.OS !== 'web') {
          e.preventDefault();
          WebBrowser.openBrowserAsync(typeof props.href === 'string' ? props.href : props.href.pathname);
        }
      }}
    />
  );
}
