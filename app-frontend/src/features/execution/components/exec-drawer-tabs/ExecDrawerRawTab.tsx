import React from "react";

export function ExecDrawerRawTab() {
    return (
        <pre
            className="font-inherit text-muted-foreground text-base leading-relaxed whitespace-pre-wrap"
            style={{
                margin: 0,
            }}
        >
            {`$ nmap -sV -p 22,80,443,5432,6379 app.targetcorp.com
Starting Nmap 7.94 at 2026-08-19 06:28:47
Nmap scan report for app.targetcorp.com (104.21.3.212)
PORT     STATE    SERVICE    VERSION
22/tcp   open     ssh        OpenSSH 8.9p1
80/tcp   open     http       nginx 1.24.0
443/tcp  open     https      nginx 1.24.0
5432/tcp filtered postgresql
6379/tcp filtered redis
Nmap done: 1 IP address scanned in 12.3 seconds`}
        </pre>
    );
}
