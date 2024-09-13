'use client';

import AnalyticsProvider from 'apps/web/contexts/Analytics';
import Card from 'apps/web/src/components/base-org/Card';
import Link from 'next/link';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import logo from './assets/logo.svg';
import Image, { StaticImageData } from 'next/image';
import { useGasPrice } from 'wagmi';
import { Icon } from 'apps/web/src/components/Icon/Icon';
import {
  ConnectWalletButton,
  ConnectWalletButtonVariants,
} from 'apps/web/src/components/ConnectWalletButton/ConnectWalletButton';

type SubItem = {
  name: string;
  href: string;
};

type TopNavigationLink = {
  name: string;
  href: string;
  emoji?: string;
  image?: string;
  subItems?: SubItem[];
};

const links: TopNavigationLink[] = [
  {
    name: 'Build',
    href: '/getstarted',
    emoji: '🛠️',
    image:
      'https://images.unsplash.com/photo-1533564810842-e9a55942212f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    subItems: [
      {
        name: 'Get Started',
        href: '/getstarted',
      },
      { name: 'Docs', href: 'https://docs.base.org' },
      { name: 'Learn', href: 'https://docs.base.org/base-learn/docs/welcome' },
      { name: 'Status Page', href: 'https://status.base.org' },
      { name: 'Block Explorer', href: 'https://base.blockscout.com' },
      { name: 'Bug Bounty', href: 'https://hackerone.com/coinbase' },
      { name: 'Github', href: 'https://github.com/base-org' },
    ],
  },
  {
    name: 'Explore',
    href: '/ecosystem',
    emoji: '🔍',
    subItems: [
      { name: 'Apps', href: '/ecosystem' },
      { name: 'Bridge', href: 'https://bridge.base.org' },
    ],
  },
  {
    name: 'Community',
    href: '/',
    emoji: '👥',
    subItems: [
      // { name: 'Events', href: '/' }, // TODO?
      // { name: 'Community Jobs', href: '/' }, // TODO?
      { name: 'Grants', href: 'https://paragraph.xyz/@grants.base.eth/calling-based-builders' },
    ],
  },
  {
    name: 'About',
    href: '/about',
    emoji: '📜',
    subItems: [
      { name: 'Vision', href: '/about' },
      { name: 'Blog', href: 'https://base.mirror.xyz/' },
      { name: 'Jobs', href: '/jobs' },
      { name: 'Media Kit', href: 'https://github.com/base-org/brand-kit' },
    ],
  },
  {
    name: 'Socials',
    href: '#socials',
    emoji: '🌐',
    subItems: [
      { name: 'X', href: 'https://x.com/base' },
      { name: 'Farcaster', href: 'https://warpcast.com/~/channel/base' },
      { name: 'Github', href: 'https://github.com/base-org' },
      { name: 'Discord', href: 'https://discord.com/invite/buildonbase' },
    ],
  },
];

export default function TopNavigation() {
  const [hoverIndex, setHoverIndex] = useState<number>(-1);
  const [subActive, setSubActive] = useState<boolean>(false);

  const { data: gasPriceInWei } = useGasPrice({
    query: {
      refetchInterval: 10_000,
    },
  });

  const [glowStyle, setGlowStyle] = useState({
    width: 0,
    height: 0,
    transform: 'translateX(0px)',
  });
  const subItemsRef = useRef<HTMLDivElement>(null);
  const [subItemsHeight, setSubItemsHeight] = useState<number>(0);

  useEffect(() => {
    if (subActive && subItemsRef.current) {
      setSubItemsHeight(subItemsRef.current.scrollHeight);
    } else {
      setSubItemsHeight(0);
    }
  }, [subActive, hoverIndex]);

  const handleHover = (index: number): void => {
    setHoverIndex(index);
    setSubActive(index > -1);
  };

  const onMouseLeaveNav = useCallback(() => {
    setSubActive(false);

    setTimeout(() => {
      handleHover(-1);
    }, 100);
  }, []);

  const onMouseEnterNavLink = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    const target = event.currentTarget as HTMLAnchorElement;
    const index = parseInt(target.getAttribute('data-index') ?? '0');

    const linkRect = target.getBoundingClientRect();

    setGlowStyle({
      width: linkRect.width,
      height: linkRect.height,
      transform: `translateX(${target.offsetLeft - 4}px)`,
    });

    handleHover(index);
  }, []);

  const convertWeiToMwei = (weiValue: bigint): number => {
    // 1 mwei = 10^6 wei
    const mweiValue = Number(weiValue) / 1_000_000;
    return Number(mweiValue.toFixed(2)); // Round to 2 decimal places
  };

  return (
    <AnalyticsProvider context="navbar">
      <nav className="fixed top-0 z-50 w-full shrink-0 px-4 py-4">
        <div className="flex w-full items-center justify-between px-4">
          {/* Logo and Gas price section */}
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image src={logo as StaticImageData} alt="Base Logo" />{' '}
            </Link>

            {gasPriceInWei && (
              <div className="flex items-center gap-2 rounded-xl bg-black px-4 py-2">
                <span className="animate-pulse text-palette-positive">
                  <Icon name="blueCircle" color="currentColor" height="0.75rem" width="0.75rem" />
                </span>
                <strong>{convertWeiToMwei(gasPriceInWei)}</strong>
                <small>Mgwei</small>
              </div>
            )}
          </div>

          {/* Top Navigation links */}
          <div
            className="relative flex flex-col items-center gap-2  rounded-xl p-1"
            onMouseLeave={onMouseLeaveNav}
          >
            <Card innerClassName="py-1" radius={8}>
              <div className="group relative flex items-center gap-0 p-1">
                {links.map((link, index) => (
                  <Link
                    key={link.name}
                    data-index={index}
                    href={link.href + '?utm_source=dotorg&utm_medium=nav'}
                    target={link.href.startsWith('https://') ? '_blank' : undefined}
                    onMouseEnter={onMouseEnterNavLink}
                    className={`rounded-lg bg-opacity-0 px-6 py-1 text-sm opacity-50 transition-all duration-300 hover:bg-opacity-10 hover:opacity-100 ${
                      hoverIndex === index ? 'bg-opacity-10 opacity-100' : ''
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Animated background */}
                <div
                  className={`pointer-events-none absolute h-full rounded-lg bg-white/20 transition-all duration-300 ease-in-out ${
                    hoverIndex > -1 ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    width: glowStyle.width,
                    transform: glowStyle.transform,
                  }}
                />
              </div>
            </Card>

            {/* Sub Menu */}
            <div
              ref={subItemsRef}
              className="absolute top-full w-full duration-300 ease-in-out"
              style={{
                height: `${subItemsHeight}px`,
                opacity: subActive ? 1 : 0,
                transform: `translateY(${subActive ? 0 : -20}px)`,
              }}
            >
              <Card radius={8}>
                <div className="flex w-full items-stretch gap-1 p-1">
                  {links[hoverIndex]?.subItems && (
                    <div className="flex flex-1 flex-col">
                      {links[hoverIndex].subItems.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href + '?utm_source=dotorg&utm_medium=nav'}
                          target={subItem.href.startsWith('https://') ? '_blank' : undefined}
                          className="group/sublink flex justify-between rounded-lg bg-white bg-opacity-0 px-3 py-2 text-sm transition-all duration-300 hover:bg-opacity-20"
                        >
                          <span>{subItem.name}</span>
                          <span className="rotate-0 transform opacity-0 transition-all delay-75 duration-300 group-hover/sublink:rotate-45 group-hover/sublink:opacity-60">
                            ↗
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                  {links[hoverIndex]?.subItems && (
                    <div className="min-h-[200px] flex-1 basis-0 overflow-hidden rounded-lg bg-white/20 bg-opacity-10">
                      {links[hoverIndex]?.emoji && (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                          <span className="text-7xl">{links[hoverIndex].emoji}</span>
                          <p className="text-xs opacity-40">(FPO)</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>

          {/* Connect Wallet button */}
          <div className="justify-end">
            <ConnectWalletButton connectWalletButtonVariant={ConnectWalletButtonVariants.BaseOrg} />
          </div>
        </div>
      </nav>
    </AnalyticsProvider>
  );
}