"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, Wallet, LogOut, Copy, Check } from "lucide-react";

function truncateAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function WalletConnectButton() {
  const { publicKey, wallet, disconnect, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toBase58());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
    setDropdownOpen(false);
  };

  if (!connected || !publicKey) {
    return (
      <Button
        variant="outline"
        onClick={() => setVisible(true)}
        className="min-w-[140px]"
      >
        <Wallet className="mr-2 h-4 w-4" />
        <span>Connect Wallet</span>
      </Button>
    );
  }

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="min-w-[140px] justify-between">
          <div className="flex items-center gap-2">
            {wallet?.adapter.icon && (
              <Avatar className="h-4 w-4">
                <AvatarImage
                  src={wallet.adapter.icon}
                  alt={wallet.adapter.name}
                />
                <AvatarFallback>
                  {wallet.adapter.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
            <span className="font-mono text-sm">
              {truncateAddress(publicKey.toBase58())}
            </span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[280px]">
        <DropdownMenuLabel>Connected Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="px-2 py-1.5">
          <div className="flex items-center gap-2">
            {wallet?.adapter.icon && (
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={wallet.adapter.icon}
                  alt={wallet.adapter.name}
                />
                <AvatarFallback>
                  {wallet.adapter.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="flex flex-col flex-1">
              <span className="text-sm font-medium">
                {wallet?.adapter.name}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {truncateAddress(publicKey.toBase58())}
              </span>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleCopyAddress}
          className="cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy Address
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleDisconnect}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
