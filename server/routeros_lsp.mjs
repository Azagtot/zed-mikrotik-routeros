#!/usr/bin/env node

import { stdin, stdout, exit } from "node:process";

const SERVER_INFO = {
  name: "mikrotik-routeros-zed",
  version: "0.1.0",
};

const TOKEN_TYPES = [
  "namespace",
  "keyword",
  "function",
  "parameter",
  "property",
  "variable",
  "string",
  "number",
  "comment",
];

const TOKEN_MODIFIERS = [];

const PATH_TREE = {
  "/ip": ["address", "route", "firewall", "dns", "dhcp-client", "dhcp-server", "pool", "service", "neighbor", "arp", "cloud", "hotspot", "ipsec"],
  "/ip/address": [],
  "/ip/route": [],
  "/ip/firewall": ["filter", "nat", "mangle", "raw", "address-list", "connection", "layer7-protocol", "service-port"],
  "/ip/firewall/filter": [],
  "/ip/firewall/nat": [],
  "/ip/firewall/mangle": [],
  "/ip/firewall/raw": [],
  "/ip/firewall/address-list": [],
  "/ip/dns": [],
  "/ip/dhcp-client": [],
  "/ip/dhcp-server": ["network", "lease", "option"],
  "/ip/dhcp-server/network": [],
  "/ip/hotspot": ["profile", "user", "user-profile", "active", "host", "ip-binding", "walled-garden"],
  "/ip/hotspot/profile": [],
  "/ip/hotspot/user": [],
  "/ip/ipsec": ["profile", "peer", "proposal", "policy", "identity", "mode-config"],
  "/ip/ipsec/profile": [],
  "/ip/ipsec/peer": [],
  "/ip/ipsec/proposal": [],
  "/ip/ipsec/policy": [],
  "/ip/pool": [],
  "/interface": ["bridge", "ethernet", "vlan", "wireguard", "bonding", "list", "ovpn-client", "ovpn-server", "pppoe-client", "pppoe-server", "lte", "vxlan", "gre", "eoip", "vrrp", "wifi", "wifiwave2", "wireless", "bridge"],
  "/interface/bridge": ["port", "vlan", "filter"],
  "/interface/bridge/port": [],
  "/interface/bridge/vlan": [],
  "/interface/vlan": [],
  "/interface/wireguard": ["peers"],
  "/interface/wireguard/peers": [],
  "/interface/list": ["member"],
  "/interface/list/member": [],
  "/interface/pppoe-client": [],
  "/interface/pppoe-server": ["server"],
  "/interface/pppoe-server/server": [],
  "/interface/lte": ["apn"],
  "/interface/lte/apn": [],
  "/interface/wifi": ["security", "configuration", "provisioning", "access-list", "datapath"],
  "/interface/wifi/security": [],
  "/interface/wifi/configuration": [],
  "/interface/wifi/provisioning": [],
  "/interface/wifiwave2": ["security", "configuration", "provisioning", "access-list", "datapath"],
  "/interface/wifiwave2/security": [],
  "/interface/wifiwave2/configuration": [],
  "/interface/wifiwave2/provisioning": [],
  "/interface/wireless": ["security-profiles", "access-list", "connect-list"],
  "/interface/wireless/security-profiles": [],
  "/routing": ["table", "rule", "ospf", "bgp", "filter", "id", "rip", "igmp-proxy"],
  "/routing/table": [],
  "/routing/rule": [],
  "/routing/ospf": ["instance", "area", "interface-template", "network"],
  "/routing/bgp": ["connection", "template", "session", "peer", "instance", "network"],
  "/routing/ospf/instance": [],
  "/routing/ospf/area": [],
  "/routing/ospf/interface-template": [],
  "/routing/ospf/network": [],
  "/routing/bgp/connection": [],
  "/routing/bgp/template": [],
  "/routing/bgp/peer": [],
  "/routing/bgp/instance": [],
  "/routing/bgp/network": [],
  "/routing/filter": ["rule", "select-rule", "community-list", "num-list"],
  "/routing/filter/rule": [],
  "/routing/filter/community-list": [],
  "/system": ["identity", "clock", "logging", "scheduler", "script", "resource", "package", "backup", "ntp", "routerboard", "health", "note", "certificate", "leds", "snmp"],
  "/system/script": [],
  "/system/scheduler": [],
  "/system/logging": ["action"],
  "/system/logging/action": [],
  "/system/snmp": [],
  "/tool": ["ping", "torch", "sniffer", "fetch", "bandwidth-server", "bandwidth-test", "mac-server", "romon", "netwatch", "email", "sms"],
  "/tool/ping": [],
  "/tool/fetch": [],
  "/tool/netwatch": [],
  "/queue": ["simple", "tree", "type", "interface"],
  "/queue/simple": [],
  "/queue/tree": [],
  "/queue/type": [],
  "/caps-man": ["manager", "configuration", "provisioning", "security", "datapath", "channel", "access-list"],
  "/caps-man/manager": [],
  "/caps-man/configuration": [],
  "/caps-man/provisioning": [],
  "/caps-man/security": [],
  "/caps-man/datapath": [],
  "/user": ["group", "ssh-keys", "aaa", "active"],
  "/user/group": [],
  "/user/ssh-keys": [],
};

const ROOT_PATHS = ["/ip", "/interface", "/routing", "/system", "/tool", "/queue", "/caps-man", "/user"];

const VERBS = [
  "add",
  "set",
  "remove",
  "print",
  "enable",
  "disable",
  "export",
  "find",
  "edit",
  "get",
  "monitor",
  "reset-counters",
  "move",
  "rename",
  "copy",
  "make-static",
  "setup",
];

const CONTROL_KEYWORDS = [
  ":if",
  ":for",
  ":foreach",
  ":while",
  ":local",
  ":global",
  ":set",
  ":put",
  ":return",
  ":delay",
  ":do",
  ":log",
  ":len",
  ":typeof",
  ":beep",
  ":resolve",
  ":totime",
  ":tonum",
  ":tostr",
  ":pick",
  ":parse",
];

const COMMON_PARAMS = [
  "name=",
  "comment=",
  "disabled=",
  "interface=",
  "address=",
  "network=",
  "gateway=",
  "distance=",
  "routing-table=",
  "protocol=",
  "src-address=",
  "dst-address=",
  "dst-port=",
  "src-port=",
  "action=",
  "chain=",
  "in-interface=",
  "out-interface=",
  "in-interface-list=",
  "out-interface-list=",
  "protocol=",
  "port=",
  "list=",
  "timeout=",
  "src-address-list=",
  "dst-address-list=",
  "connection-mark=",
  "routing-mark=",
  "disabled=",
];

const PATH_PARAMS = {
  "/ip/address": ["address=", "interface=", "network=", "comment=", "disabled="],
  "/ip/route": ["dst-address=", "gateway=", "distance=", "routing-table=", "check-gateway=", "pref-src=", "scope=", "target-scope=", "comment=", "disabled="],
  "/ip/firewall/filter": ["chain=", "action=", "protocol=", "src-address=", "dst-address=", "src-port=", "dst-port=", "in-interface=", "out-interface=", "in-interface-list=", "out-interface-list=", "src-address-list=", "dst-address-list=", "connection-state=", "tcp-flags=", "log=", "log-prefix=", "comment=", "disabled="],
  "/ip/firewall/nat": ["chain=", "action=", "protocol=", "src-address=", "dst-address=", "src-port=", "dst-port=", "to-addresses=", "to-ports=", "in-interface=", "out-interface=", "in-interface-list=", "out-interface-list=", "src-address-list=", "dst-address-list=", "log=", "comment=", "disabled="],
  "/ip/firewall/mangle": ["chain=", "action=", "new-routing-mark=", "new-connection-mark=", "new-packet-mark=", "passthrough=", "src-address=", "dst-address=", "in-interface=", "out-interface=", "protocol=", "comment=", "disabled="],
  "/ip/firewall/raw": ["chain=", "action=", "protocol=", "src-address=", "dst-address=", "src-port=", "dst-port=", "in-interface=", "out-interface=", "src-address-list=", "dst-address-list=", "comment=", "disabled="],
  "/ip/firewall/address-list": ["list=", "address=", "timeout=", "comment=", "disabled="],
  "/ip/dns": ["allow-remote-requests=", "servers=", "cache-size=", "max-concurrent-queries=", "verify-doh-cert=", "use-doh-server="],
  "/ip/dhcp-client": ["interface=", "add-default-route=", "default-route-distance=", "use-peer-dns=", "use-peer-ntp=", "script=", "comment=", "disabled="],
  "/ip/dhcp-server/network": ["address=", "gateway=", "dns-server=", "domain=", "ntp-server=", "comment="],
  "/ip/pool": ["name=", "ranges=", "next-pool=", "comment="],
  "/ip/hotspot/profile": ["name=", "hotspot-address=", "dns-name=", "html-directory=", "login-by=", "rate-limit=", "smtp-server=", "split-user-domain="],
  "/ip/hotspot/user": ["name=", "password=", "profile=", "server=", "address=", "mac-address=", "comment=", "disabled="],
  "/ip/ipsec/profile": ["name=", "dh-group=", "enc-algorithm=", "hash-algorithm=", "nat-traversal=", "dpd-interval=", "proposal-check="],
  "/ip/ipsec/peer": ["address=", "profile=", "exchange-mode=", "local-address=", "passive=", "send-initial-contact=", "comment=", "disabled="],
  "/ip/ipsec/proposal": ["name=", "auth-algorithms=", "enc-algorithms=", "lifetime=", "pfs-group=", "disabled="],
  "/ip/ipsec/policy": ["src-address=", "dst-address=", "proposal=", "peer=", "template=", "tunnel=", "level=", "action=", "comment=", "disabled="],
  "/interface/bridge": ["name=", "protocol-mode=", "vlan-filtering=", "comment=", "disabled="],
  "/interface/bridge/port": ["bridge=", "interface=", "pvid=", "horizon=", "frame-types=", "ingress-filtering=", "trusted=", "comment=", "disabled="],
  "/interface/bridge/vlan": ["bridge=", "vlan-ids=", "tagged=", "untagged=", "comment="],
  "/interface/vlan": ["name=", "interface=", "vlan-id=", "comment=", "disabled="],
  "/interface/list/member": ["interface=", "list=", "comment=", "disabled="],
  "/interface/wireguard": ["name=", "listen-port=", "mtu=", "private-key=", "comment=", "disabled="],
  "/interface/wireguard/peers": ["interface=", "public-key=", "allowed-address=", "endpoint-address=", "endpoint-port=", "persistent-keepalive=", "comment=", "disabled="],
  "/interface/pppoe-client": ["name=", "interface=", "user=", "password=", "add-default-route=", "default-route-distance=", "dial-on-demand=", "disabled="],
  "/interface/pppoe-server/server": ["service-name=", "interface=", "default-profile=", "authentication=", "one-session-per-host=", "max-mru=", "max-mtu=", "disabled="],
  "/interface/lte/apn": ["name=", "apn=", "ip-type=", "use-network-apn=", "default-route-distance=", "add-default-route=", "comment=", "disabled="],
  "/interface/wifi/security": ["name=", "authentication-types=", "passphrase=", "ft=", "wps=", "management-protection=", "disabled="],
  "/interface/wifi/configuration": ["name=", "ssid=", "country=", "mode=", "security=", "channel.skip-dfs-channels=", "datapath=", "disabled="],
  "/interface/wifi/provisioning": ["action=", "master-configuration=", "slave-configurations=", "supported-bands=", "identity-regexp=", "disabled="],
  "/interface/wifiwave2/security": ["name=", "authentication-types=", "passphrase=", "ft=", "wps=", "management-protection=", "disabled="],
  "/interface/wifiwave2/configuration": ["name=", "ssid=", "country=", "mode=", "security=", "channel.skip-dfs-channels=", "datapath=", "disabled="],
  "/interface/wifiwave2/provisioning": ["action=", "master-configuration=", "slave-configurations=", "supported-bands=", "identity-regexp=", "disabled="],
  "/interface/wireless/security-profiles": ["name=", "mode=", "authentication-types=", "wpa2-pre-shared-key=", "supplicant-identity=", "management-protection="],
  "/routing/table": ["name=", "fib=", "disabled="],
  "/routing/rule": ["action=", "src-address=", "dst-address=", "interface=", "routing-mark=", "table=", "comment=", "disabled="],
  "/routing/ospf/instance": ["name=", "version=", "router-id=", "vrf=", "redistribute=", "out-filter-chain=", "disabled="],
  "/routing/ospf/area": ["name=", "area-id=", "instance=", "type=", "disabled="],
  "/routing/ospf/interface-template": ["area=", "interfaces=", "networks=", "cost=", "priority=", "type=", "disabled="],
  "/routing/ospf/network": ["network=", "area=", "comment=", "disabled="],
  "/routing/bgp/connection": ["name=", "remote.address=", "remote.as=", "local.address=", "local.as=", "router-id=", "templates=", "listen=", "multihop=", "disabled="],
  "/routing/bgp/template": ["name=", "as=", "router-id=", "address-families=", "output.network=", "routing-table=", "disabled="],
  "/routing/bgp/peer": ["name=", "remote-address=", "remote-as=", "update-source=", "in-filter=", "out-filter=", "tcp-md5-key=", "multihop=", "ttl=", "disabled="],
  "/routing/bgp/instance": ["name=", "as=", "router-id=", "client-to-client-reflection=", "ignore-as-path-len=", "out-filter=", "redistribute-connected="],
  "/routing/bgp/network": ["network=", "synchronize=", "disabled="],
  "/routing/filter/rule": ["chain=", "rule=", "comment=", "disabled="],
  "/routing/filter/community-list": ["list=", "communities=", "regexp=", "comment=", "disabled="],
  "/system/script": ["name=", "owner=", "policy=", "source=", "comment="],
  "/system/scheduler": ["name=", "start-date=", "start-time=", "interval=", "on-event=", "policy=", "comment=", "disabled="],
  "/system/logging": ["topics=", "action=", "prefix=", "disabled="],
  "/tool/ping": ["address=", "count=", "interval=", "interface=", "routing-table=", "size="],
  "/tool/fetch": ["url=", "mode=", "dst-path=", "src-path=", "user=", "password=", "host=", "port="],
  "/tool/netwatch": ["host=", "type=", "interval=", "up-script=", "down-script=", "comment=", "disabled="],
  "/queue/simple": ["name=", "target=", "dst=", "parent=", "packet-marks=", "priority=", "queue=", "max-limit=", "limit-at=", "burst-limit=", "burst-time=", "disabled="],
  "/queue/tree": ["name=", "parent=", "packet-mark=", "queue=", "priority=", "max-limit=", "limit-at=", "burst-limit=", "burst-time=", "disabled="],
  "/queue/type": ["name=", "kind=", "pcq-classifier=", "pcq-rate=", "pcq-limit=", "pcq-total-limit=", "fq-codel-limit=", "cake-bandwidth="],
  "/caps-man/manager": ["enabled=", "ca-certificate=", "certificate=", "upgrade-policy="],
  "/caps-man/configuration": ["name=", "ssid=", "country=", "security=", "channel=", "datapath=", "mode=", "hide-ssid=", "comment="],
  "/caps-man/provisioning": ["action=", "master-configuration=", "slave-configurations=", "hw-supported-modes=", "name-format=", "name-prefix=", "comment=", "disabled="],
  "/caps-man/security": ["name=", "authentication-types=", "encryption=", "passphrase=", "group-encryption=", "group-key-update=", "comment="],
  "/caps-man/datapath": ["name=", "bridge=", "vlan-id=", "vlan-mode=", "local-forwarding=", "client-to-client-forwarding=", "comment="],
  "/user": ["name=", "group=", "password=", "address=", "comment=", "disabled="],
  "/user/group": ["name=", "policy=", "skin=", "comment="],
};

const BOOL_VALUES = ["yes", "no", "true", "false"];
const ACTION_VALUES = ["accept", "drop", "reject", "log", "fasttrack-connection", "jump", "return", "passthrough", "mark-routing", "mark-connection", "mark-packet", "src-nat", "masquerade", "dst-nat", "netmap", "redirect", "same", "notrack"];
const CHAIN_VALUES = ["input", "output", "forward", "prerouting", "postrouting", "srcnat", "dstnat"];
const PROTOCOL_VALUES = ["tcp", "udp", "icmp", "gre", "ospf", "ipsec-esp", "ipsec-ah", "sctp", "icmpv6"];
const INTERFACE_MODE_VALUES = ["station", "ap", "ap-bridge", "station-bridge", "station-pseudobridge"];
const ROUTING_RULE_ACTIONS = ["lookup", "lookup-only-in-table", "drop", "unreachable"];
const VALUE_SUGGESTIONS = {
  action: ACTION_VALUES,
  chain: CHAIN_VALUES,
  protocol: PROTOCOL_VALUES,
  disabled: BOOL_VALUES,
  "vlan-filtering": BOOL_VALUES,
  "allow-remote-requests": BOOL_VALUES,
  "use-peer-dns": BOOL_VALUES,
  "use-peer-ntp": BOOL_VALUES,
  "add-default-route": BOOL_VALUES,
  "verify-doh-cert": BOOL_VALUES,
  "nat-traversal": BOOL_VALUES,
  passive: BOOL_VALUES,
  tunnel: BOOL_VALUES,
  trusted: BOOL_VALUES,
  "ingress-filtering": BOOL_VALUES,
  fib: BOOL_VALUES,
  listen: BOOL_VALUES,
  multihop: BOOL_VALUES,
  enabled: BOOL_VALUES,
  "local-forwarding": BOOL_VALUES,
  "client-to-client-forwarding": BOOL_VALUES,
  log: BOOL_VALUES,
  passthrough: BOOL_VALUES,
  mode: INTERFACE_MODE_VALUES,
  "protocol-mode": ["none", "rstp", "mstp"],
  "frame-types": ["admit-all", "admit-only-vlan-tagged", "admit-only-untagged-and-priority-tagged"],
  "connection-state": ["new", "established", "related", "invalid", "untracked"],
  "check-gateway": ["arp", "ping", "bfd"],
  "exchange-mode": ["ike2", "main", "aggressive"],
  "dh-group": ["modp1024", "modp1536", "modp2048", "ecp256", "ecp384"],
  "enc-algorithm": ["aes-128", "aes-192", "aes-256", "3des"],
  "hash-algorithm": ["sha1", "sha256", "sha512", "md5"],
  "pfs-group": ["none", "modp1024", "modp1536", "modp2048", "ecp256", "ecp384"],
  authentication: ["pap", "chap", "mschap1", "mschap2"],
  "authentication-types": ["wpa2-psk", "wpa3-psk", "wpa2-eap", "wpa3-eap"],
  encryption: ["aes-ccm", "aes-ccm-256", "tkip"],
  "management-protection": ["disabled", "allowed", "required"],
  "supported-bands": ["2ghz-b/g/n", "5ghz-a/n/ac", "5ghz-ax", "2ghz-ax"],
  type: ["icmp", "simple", "tcp-conn", "https-get", "dns"],
  kind: ["pfifo", "bfifo", "sfq", "red", "pcq", "fq-codel", "cake"],
  "pcq-classifier": ["src-address", "dst-address", "src-port", "dst-port"],
};

const SNIPPETS = [
  {
    contexts: ["/ip/firewall/filter"],
    label: "drop wan input",
    detail: "Firewall filter template",
    insertText: "add chain=input action=drop in-interface=${1:ether1} connection-state=${2:new} comment=\"${3:drop unsolicited WAN input}\"",
  },
  {
    contexts: ["/ip/firewall/filter"],
    label: "allow established/related",
    detail: "Firewall filter template",
    insertText: "add chain=${1:forward} action=accept connection-state=established,related comment=\"${2:allow established related}\"",
  },
  {
    contexts: ["/ip/firewall/nat"],
    label: "masquerade wan",
    detail: "NAT template",
    insertText: "add chain=srcnat action=masquerade out-interface=${1:ether1} comment=\"${2:wan masquerade}\"",
  },
  {
    contexts: ["/ip/firewall/nat"],
    label: "dst-nat port forward",
    detail: "NAT template",
    insertText: "add chain=dstnat action=dst-nat protocol=${1:tcp} dst-port=${2:443} in-interface=${3:ether1} to-addresses=${4:192.168.88.10} to-ports=${5:443} comment=\"${6:port forward}\"",
  },
  {
    contexts: ["/ip/firewall/mangle"],
    label: "mark routing",
    detail: "Mangle template",
    insertText: "add chain=prerouting action=mark-routing new-routing-mark=${1:wan2} passthrough=${2:no} src-address=${3:192.168.88.0/24} comment=\"${4:policy routing}\"",
  },
  {
    contexts: ["/ip/address"],
    label: "address on interface",
    detail: "IP address template",
    insertText: "add address=${1:192.168.88.1/24} interface=${2:bridge} comment=\"${3:lan gateway}\"",
  },
  {
    contexts: ["/ip/route"],
    label: "default route",
    detail: "Route template",
    insertText: "add dst-address=0.0.0.0/0 gateway=${1:192.0.2.1} distance=${2:1} routing-table=${3:main} comment=\"${4:default route}\"",
  },
  {
    contexts: ["/ip/route"],
    label: "dual wan failover",
    detail: "Failover template",
    insertText: "add dst-address=0.0.0.0/0 gateway=${1:192.0.2.1} distance=1 check-gateway=ping comment=\"${2:primary wan}\"\nadd dst-address=0.0.0.0/0 gateway=${3:198.51.100.1} distance=2 check-gateway=ping comment=\"${4:backup wan}\"",
  },
  {
    contexts: ["/interface/vlan"],
    label: "vlan interface",
    detail: "VLAN template",
    insertText: "add name=${1:vlan10} interface=${2:bridge} vlan-id=${3:10} comment=\"${4:user vlan}\"",
  },
  {
    contexts: ["/interface/bridge/vlan"],
    label: "bridge vlan row",
    detail: "Bridge VLAN template",
    insertText: "add bridge=${1:bridge} vlan-ids=${2:10} tagged=${3:bridge,ether1} untagged=${4:ether2,ether3} comment=\"${5:access ports}\"",
  },
  {
    contexts: ["/interface/bridge/vlan"],
    label: "guest wifi vlan",
    detail: "Guest Wi-Fi template",
    insertText: "/interface/vlan add name=${1:vlan20-guest} interface=${2:bridge} vlan-id=${3:20} comment=\"${4:guest vlan}\"\n/interface/bridge/vlan add bridge=${2:bridge} vlan-ids=${3:20} tagged=${5:bridge,ether1} untagged=${6:ether4} comment=\"${7:guest access}\"\n/ip address add address=${8:192.168.20.1/24} interface=${1:vlan20-guest} comment=\"${9:guest gateway}\"\n/ip pool add name=${10:guest_pool} ranges=${11:192.168.20.10-192.168.20.250}\n/ip dhcp-server add name=${12:guest_dhcp} interface=${1:vlan20-guest} address-pool=${10:guest_pool} disabled=no\n/ip dhcp-server network add address=${13:192.168.20.0/24} gateway=${14:192.168.20.1} dns-server=${15:1.1.1.1,8.8.8.8}",
  },
  {
    contexts: ["/interface/bridge/port"],
    label: "bridge access port",
    detail: "Bridge port template",
    insertText: "add bridge=${1:bridge} interface=${2:ether2} pvid=${3:10} ingress-filtering=${4:yes} frame-types=${5:admit-only-untagged-and-priority-tagged}",
  },
  {
    contexts: ["/interface/wireguard"],
    label: "wireguard interface",
    detail: "WireGuard template",
    insertText: "add name=${1:wg0} listen-port=${2:13231} mtu=${3:1420} comment=\"${4:wireguard tunnel}\"",
  },
  {
    contexts: ["/interface/wireguard"],
    label: "[v7] wireguard interface",
    detail: "RouterOS v7 template",
    insertText: "add name=${1:wg-v7} listen-port=${2:13231} mtu=${3:1420} comment=\"${4:RouterOS v7 WireGuard}\"",
  },
  {
    contexts: ["/interface/wireguard/peers"],
    label: "wireguard peer",
    detail: "WireGuard template",
    insertText: "add interface=${1:wg0} public-key=\"${2:PUBLIC_KEY}\" allowed-address=${3:10.10.10.2/32} endpoint-address=${4:vpn.example.com} endpoint-port=${5:13231} persistent-keepalive=${6:25} comment=\"${7:peer}\"",
  },
  {
    contexts: ["/interface/wireguard"],
    label: "wireguard site-to-site",
    detail: "WireGuard template",
    insertText: "add name=${1:wg-site} listen-port=${2:13231} mtu=${3:1420} comment=\"${4:site-to-site tunnel}\"\n/ip address add address=${5:10.255.255.1/30} interface=${1:wg-site} comment=\"${6:wg transit}\"\n/interface/wireguard/peers add interface=${1:wg-site} public-key=\"${7:REMOTE_PUBLIC_KEY}\" allowed-address=${8:10.255.255.2/32,192.168.50.0/24} endpoint-address=${9:remote.example.com} endpoint-port=${10:13231} persistent-keepalive=25 comment=\"${11:remote site}\"",
  },
  {
    contexts: ["/routing/bgp/connection"],
    label: "bgp connection",
    detail: "BGP template",
    insertText: "add name=${1:upstream1} remote.address=${2:203.0.113.1} remote.as=${3:64501} local.address=${4:203.0.113.2} local.as=${5:64500} router-id=${6:203.0.113.2} templates=${7:default} comment=\"${8:bgp upstream}\"",
  },
  {
    contexts: ["/routing/bgp/peer"],
    label: "[v6] bgp peer",
    detail: "RouterOS v6 template",
    insertText: "add name=${1:upstream1} remote-address=${2:203.0.113.1} remote-as=${3:64501} update-source=${4:ether1} in-filter=${5:IN-UPSTREAM1} out-filter=${6:OUT-UPSTREAM1} comment=\"${7:RouterOS v6 peer}\"",
  },
  {
    contexts: ["/routing/bgp/connection"],
    label: "bgp upstream + filters",
    detail: "BGP template",
    insertText: "/routing/filter/rule add chain=${1:IN-UPSTREAM1} rule=\"${2:if (dst in 0.0.0.0/0) { accept } else { reject }}\" comment=\"${3:accept default only}\"\n/routing/filter/rule add chain=${4:OUT-UPSTREAM1} rule=\"${5:if (dst in 203.0.113.0/24) { accept } else { reject }}\" comment=\"${6:advertise owned prefix}\"\n/routing/bgp/template add name=${7:upstream1-template} as=${8:64500} router-id=${9:203.0.113.2} address-families=${10:ip} routing-table=${11:main}\n/routing/bgp/connection add name=${12:upstream1} remote.address=${13:203.0.113.1} remote.as=${14:64501} local.address=${15:203.0.113.2} local.as=${8:64500} templates=${7:upstream1-template} input.filter=${1:IN-UPSTREAM1} output.filter-chain=${4:OUT-UPSTREAM1}",
  },
  {
    contexts: ["/routing/bgp/template"],
    label: "bgp template",
    detail: "BGP template",
    insertText: "add name=${1:default} as=${2:64500} router-id=${3:203.0.113.2} address-families=${4:ip,ipv6} routing-table=${5:main}",
  },
  {
    contexts: ["/routing/ospf/interface-template"],
    label: "ospf interface-template",
    detail: "OSPF template",
    insertText: "add area=${1:backbone} interfaces=${2:bridge} networks=${3:10.0.0.0/24} cost=${4:10} comment=\"${5:ospf lan}\"",
  },
  {
    contexts: ["/routing/ospf/network"],
    label: "[v6] ospf network",
    detail: "RouterOS v6 template",
    insertText: "add network=${1:10.0.0.0/24} area=${2:backbone} comment=\"${3:RouterOS v6 OSPF network}\"",
  },
  {
    contexts: ["/queue/simple"],
    label: "simple queue",
    detail: "Queue template",
    insertText: "add name=${1:client1} target=${2:192.168.88.10/32} max-limit=${3:50M/50M} limit-at=${4:10M/10M} comment=\"${5:rate limit}\"",
  },
  {
    contexts: ["/queue/tree"],
    label: "queue tree",
    detail: "Queue template",
    insertText: "add name=${1:download} parent=${2:global} packet-mark=${3:download} queue=${4:default} max-limit=${5:100M}",
  },
  {
    contexts: ["/caps-man/configuration"],
    label: "capsman config",
    detail: "CAPsMAN template",
    insertText: "add name=${1:corp-5g} ssid=\"${2:Corp WiFi}\" country=${3:russia} security=${4:wpa2} datapath=${5:bridge-lan} mode=${6:ap}",
  },
  {
    contexts: ["/interface/wireless/security-profiles"],
    label: "[v6] wireless security-profile",
    detail: "RouterOS v6 template",
    insertText: "add name=${1:wpa2-home} mode=${2:dynamic-keys} authentication-types=${3:wpa2-psk} wpa2-pre-shared-key=\"${4:strongpassword}\" supplicant-identity=${5:MikroTik}",
  },
  {
    contexts: ["/caps-man/provisioning", "/interface/wifi/provisioning", "/interface/wifiwave2/provisioning"],
    label: "wifi provisioning",
    detail: "Provisioning template",
    insertText: "add action=${1:create-enabled} master-configuration=${2:cfg-main} supported-bands=${3:5ghz-ax} name-format=${4:prefix-identity} name-prefix=${5:ap}",
  },
  {
    contexts: ["/system/scheduler"],
    label: "scheduler job",
    detail: "Scheduler template",
    insertText: "add name=${1:nightly-backup} start-time=${2:03:00:00} interval=${3:1d} on-event=\"${4:/system backup save name=nightly}\" policy=${5:ftp,reboot,read,write,policy,test,password,sniff,sensitive,romon}",
  },
  {
    contexts: ["/system/script"],
    label: "script",
    detail: "RouterOS script template",
    insertText: "add name=${1:script-name} source={\n    :local iface \"${2:ether1}\"\n    :log info \"${3:script started}\"\n    ${4}\n}",
  },
  {
    contexts: ["/system/script"],
    label: "basic home firewall",
    detail: "Firewall template",
    insertText: "/ip/firewall/filter add chain=input action=accept connection-state=established,related comment=\"${1:accept established}\"\n/ip/firewall/filter add chain=input action=drop connection-state=invalid comment=\"${2:drop invalid}\"\n/ip/firewall/filter add chain=input action=accept protocol=icmp comment=\"${3:allow icmp}\"\n/ip/firewall/filter add chain=input action=accept in-interface=${4:bridge} comment=\"${5:allow lan to router}\"\n/ip/firewall/filter add chain=input action=drop in-interface=${6:ether1} comment=\"${7:drop wan to router}\"\n/ip/firewall/filter add chain=forward action=fasttrack-connection connection-state=established,related comment=\"${8:fasttrack}\"\n/ip/firewall/filter add chain=forward action=accept connection-state=established,related comment=\"${9:accept established forward}\"\n/ip/firewall/filter add chain=forward action=drop connection-state=invalid comment=\"${10:drop invalid forward}\"",
  },
  {
    contexts: ["/tool/netwatch"],
    label: "netwatch host",
    detail: "Netwatch template",
    insertText: "add host=${1:8.8.8.8} interval=${2:30s} up-script=\"${3::log info \\\"link is up\\\"}\" down-script=\"${4::log warning \\\"link is down\\\"}\" comment=\"${5:uplink watchdog}\"",
  },
];

const documents = new Map();
let buffer = Buffer.alloc(0);

stdin.on("data", (chunk) => {
  buffer = Buffer.concat([buffer, chunk]);
  processBuffer();
});

stdin.on("end", () => exit(0));

function processBuffer() {
  while (true) {
    const headerEnd = buffer.indexOf("\r\n\r\n");
    if (headerEnd === -1) {
      return;
    }

    const header = buffer.slice(0, headerEnd).toString("utf8");
    const contentLengthMatch = header.match(/Content-Length:\s*(\d+)/i);
    if (!contentLengthMatch) {
      buffer = buffer.slice(headerEnd + 4);
      continue;
    }

    const contentLength = Number(contentLengthMatch[1]);
    const totalLength = headerEnd + 4 + contentLength;
    if (buffer.length < totalLength) {
      return;
    }

    const body = buffer.slice(headerEnd + 4, totalLength).toString("utf8");
    buffer = buffer.slice(totalLength);

    try {
      handleMessage(JSON.parse(body));
    } catch (error) {
      notifyError(`Failed to parse message: ${String(error)}`);
    }
  }
}

function handleMessage(message) {
  if (message.method === "initialize") {
    reply(message.id, {
      capabilities: {
        textDocumentSync: 1,
        completionProvider: {
          triggerCharacters: ["/", " ", "-", "=", ":"],
          resolveProvider: false,
        },
        semanticTokensProvider: {
          legend: {
            tokenTypes: TOKEN_TYPES,
            tokenModifiers: TOKEN_MODIFIERS,
          },
          full: true,
        },
      },
      serverInfo: SERVER_INFO,
    });
    return;
  }

  if (message.method === "initialized") {
    return;
  }

  if (message.method === "shutdown") {
    reply(message.id, null);
    return;
  }

  if (message.method === "exit") {
    exit(0);
  }

  if (message.method === "textDocument/didOpen") {
    const { uri, text } = message.params.textDocument;
    documents.set(uri, text);
    publishDiagnostics(uri, text);
    return;
  }

  if (message.method === "textDocument/didChange") {
    const { uri } = message.params.textDocument;
    const changes = message.params.contentChanges ?? [];
    const latest = changes.at(-1);
    if (latest && typeof latest.text === "string") {
      documents.set(uri, latest.text);
      publishDiagnostics(uri, latest.text);
    }
    return;
  }

  if (message.method === "textDocument/didClose") {
    const { uri } = message.params.textDocument;
    documents.delete(uri);
    publishDiagnostics(uri, "");
    return;
  }

  if (message.method === "textDocument/completion") {
    const items = getCompletionItems(message.params);
    reply(message.id, {
      isIncomplete: false,
      items,
    });
    return;
  }

  if (message.method === "textDocument/semanticTokens/full") {
    const { uri } = message.params.textDocument;
    const text = documents.get(uri) ?? "";
    reply(message.id, {
      data: buildSemanticTokens(text),
    });
    return;
  }

  if (Object.prototype.hasOwnProperty.call(message, "id")) {
    replyError(message.id, -32601, `Method not supported: ${message.method}`);
  }
}

function getCompletionItems(params) {
  const uri = params.textDocument.uri;
  const text = documents.get(uri) ?? "";
  const position = params.position;
  const lines = text.split(/\r?\n/);
  const line = lines[position.line] ?? "";
  const beforeCursor = line.slice(0, position.character);
  const endedWithSpace = /\s$/.test(beforeCursor);
  const tokens = beforeCursor.trim().length === 0 ? [] : beforeCursor.trim().split(/\s+/);
  const activeToken = endedWithSpace ? "" : (tokens.at(-1) ?? "");
  const completedTokens = endedWithSpace ? tokens : tokens.slice(0, -1);
  const pathInfo = detectPathContext(tokens, activeToken, endedWithSpace);

  if (pathInfo.inPath) {
    const items = [
      ...suggestPathSegments(pathInfo.parentPath, pathInfo.partial),
      ...(!pathInfo.partial ? VERBS.map((verb) => completion(verb, 3, "verb")) : []),
    ];
    return dedupe(items);
  }

  const fullPath = pathInfo.fullPath;
  const hasVerb = completedTokens.concat(activeToken ? [activeToken] : []).some((token) => VERBS.includes(token));
  const suggestions = [];

  if (!tokens.length || activeToken.startsWith("/")) {
    suggestions.push(...ROOT_PATHS.map((item) => completion(item, 3, "path")));
  }

  if (activeToken.startsWith(":") || !tokens.length) {
    suggestions.push(...CONTROL_KEYWORDS.map((item) => completion(item, 14, "keyword")));
  }

  if (!hasVerb || VERBS.some((verb) => verb.startsWith(activeToken))) {
    suggestions.push(...VERBS.map((item) => completion(item, 3, "verb")));
  }

  suggestions.push(...getSnippetCompletions(fullPath));

  if (activeToken.includes("=")) {
    const [lhs] = activeToken.split("=");
    const values = VALUE_SUGGESTIONS[lhs];
    if (values) {
      suggestions.push(...values.map((item) => completion(item, 12, "value")));
    }
  } else {
    const paramsForPath = PATH_PARAMS[fullPath] ?? [];
    suggestions.push(...paramsForPath.map((item) => completion(item, 10, "parameter")));
    suggestions.push(...COMMON_PARAMS.map((item) => completion(item, 10, "parameter")));
  }

  return dedupe(filterByPrefix(suggestions, activeToken));
}

function detectPathContext(tokens, activeToken, endedWithSpace) {
  if (!tokens.length && !activeToken) {
    return { inPath: true, parentPath: "", partial: "", fullPath: "" };
  }

  const allTokens = endedWithSpace ? tokens : tokens;
  const pathTokens = [];

  for (let index = 0; index < allTokens.length; index += 1) {
    const token = allTokens[index];
    if (index === 0 && token.startsWith("/")) {
      pathTokens.push(token);
      continue;
    }

    if (pathTokens.length > 0 && !isStopToken(token)) {
      pathTokens.push(token);
      continue;
    }

    break;
  }

  const inPath = (
    (tokens.length === 0 && !endedWithSpace) ||
    (pathTokens.length > 0 && (
      endedWithSpace
        ? tokens.length === pathTokens.length
        : tokens.length - 1 < pathTokens.length || (tokens.length === pathTokens.length && !isStopToken(activeToken))
    ))
  );

  let parentTokens = pathTokens.slice();
  let partial = "";

  if (!endedWithSpace && tokens.length === pathTokens.length && tokens.length > 0) {
    partial = activeToken;
    parentTokens = pathTokens.slice(0, -1);
  }

  return {
    inPath,
    parentPath: normalizePath(parentTokens),
    partial,
    fullPath: normalizePath(pathTokens),
  };
}

function isStopToken(token) {
  return token.includes("=") || VERBS.includes(token) || token.startsWith(":");
}

function normalizePath(tokens) {
  if (!tokens.length) {
    return "";
  }

  const segments = [];
  for (const token of tokens) {
    const cleaned = token.replace(/^\//, "");
    if (cleaned) {
      segments.push(cleaned);
    }
  }

  return segments.length ? `/${segments.join("/")}` : "";
}

function suggestPathSegments(parentPath, partial) {
  const partialText = partial.replace(/^\//, "");
  const items = [];
  const options = parentPath ? (PATH_TREE[parentPath] ?? []) : ROOT_PATHS.map((item) => item.slice(1));

  for (const option of options) {
    const insertText = parentPath ? option : `/${option}`;
    items.push(completion(insertText, 17, "path"));
  }

  return filterByPrefix(items, partialText || partial);
}

function completion(label, kind, detail) {
  return {
    label,
    kind,
    detail: `RouterOS ${detail}`,
    insertText: label,
  };
}

function snippetCompletion(label, detail, insertText) {
  return {
    label,
    kind: 15,
    detail,
    insertText,
    insertTextFormat: 2,
    sortText: "00",
  };
}

function getSnippetCompletions(fullPath) {
  if (!fullPath) {
    return [];
  }

  return SNIPPETS
    .filter((snippet) => snippet.contexts.includes(fullPath))
    .map((snippet) => snippetCompletion(snippet.label, snippet.detail, snippet.insertText));
}

function filterByPrefix(items, prefix) {
  if (!prefix) {
    return items;
  }

  const normalized = prefix.replace(/^\//, "").toLowerCase();
  return items.filter((item) => item.label.replace(/^\//, "").toLowerCase().startsWith(normalized));
}

function dedupe(items) {
  const seen = new Set();
  const unique = [];

  for (const item of items) {
    if (seen.has(item.label)) {
      continue;
    }
    seen.add(item.label);
    unique.push(item);
  }

  return unique;
}

function buildSemanticTokens(text) {
  const data = [];
  const lines = text.split(/\r?\n/);
  let previousLine = 0;
  let previousStart = 0;

  const pushToken = (line, start, length, tokenType) => {
    const tokenTypeIndex = TOKEN_TYPES.indexOf(tokenType);
    if (tokenTypeIndex === -1 || length <= 0) {
      return;
    }

    const deltaLine = line - previousLine;
    const deltaStart = deltaLine === 0 ? start - previousStart : start;
    data.push(deltaLine, deltaStart, length, tokenTypeIndex, 0);
    previousLine = line;
    previousStart = start;
  };

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];
    if (!line) {
      continue;
    }

    const commentStart = line.indexOf("#");
    const semanticRangeEnd = commentStart >= 0 ? commentStart : line.length;

    if (commentStart >= 0) {
      pushToken(lineIndex, commentStart, line.length - commentStart, "comment");
    }

    for (const match of line.slice(0, semanticRangeEnd).matchAll(/"([^"\\]|\\.)*"/g)) {
      pushToken(lineIndex, match.index ?? 0, match[0].length, "string");
    }

    for (const match of line.slice(0, semanticRangeEnd).matchAll(/\$\w+/g)) {
      pushToken(lineIndex, match.index ?? 0, match[0].length, "variable");
    }

    for (const match of line.slice(0, semanticRangeEnd).matchAll(/\b\d+\b/g)) {
      pushToken(lineIndex, match.index ?? 0, match[0].length, "number");
    }

    for (const match of line.slice(0, semanticRangeEnd).matchAll(/(^|\s)(:\w[\w-]*|\w[\w-]*=|\/[^\s]+)/g)) {
      const token = match[2];
      const start = (match.index ?? 0) + match[0].lastIndexOf(token);

      if (token.startsWith(":")) {
        pushToken(lineIndex, start, token.length, "keyword");
        continue;
      }

      if (token.endsWith("=")) {
        pushToken(lineIndex, start, token.length, "property");
        continue;
      }

      if (token.startsWith("/")) {
        pushToken(lineIndex, start, token.length, "namespace");
      }
    }

    for (const verb of VERBS) {
      const regex = new RegExp(`(^|\\s)(${escapeRegExp(verb)})(?=\\s|$)`, "g");
      for (const match of line.slice(0, semanticRangeEnd).matchAll(regex)) {
        const start = (match.index ?? 0) + match[0].lastIndexOf(verb);
        pushToken(lineIndex, start, verb.length, "function");
      }
    }
  }

  return data;
}

function publishDiagnostics(uri, text) {
  notify("textDocument/publishDiagnostics", {
    uri,
    diagnostics: collectDiagnostics(text),
  });
}

function collectDiagnostics(text) {
  const diagnostics = [];
  const lines = text.split(/\r?\n/);
  const braceStack = [];

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];
    const trimmed = line.trim();
    const path = extractInlinePath(trimmed);

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    trackBracesAndQuotes(line, lineIndex, diagnostics, braceStack);

    if (isFirewallPath(path) && /\badd\b/.test(trimmed)) {
      requireToken(line, lineIndex, diagnostics, "chain=", "Firewall rule is missing `chain=`.");
      requireToken(line, lineIndex, diagnostics, "action=", "Firewall rule is missing `action=`.");
    }

    if (path === "/ip/firewall/filter" && /\bchain=(srcnat|dstnat)\b/.test(trimmed)) {
      addDiagnostic(diagnostics, lineIndex, findIndex(line, "chain="), "Use `srcnat` and `dstnat` chains under `/ip/firewall/nat`, not `/ip/firewall/filter`.", 2);
    }

    if (path !== "/ip/firewall/nat" && /\baction=(masquerade|src-nat|dst-nat|netmap|redirect)\b/.test(trimmed)) {
      addDiagnostic(diagnostics, lineIndex, findIndex(line, "action="), "NAT actions belong under `/ip/firewall/nat`.", 2);
    }

    if (path === "/ip/address" && /\badd\b/.test(trimmed) && /\baddress=([^\s"]+)/.test(trimmed)) {
      const address = trimmed.match(/\baddress=([^\s"]+)/)?.[1] ?? "";
      if (!address.includes("/")) {
        addDiagnostic(diagnostics, lineIndex, findIndex(line, "address="), "`/ip/address add` usually expects CIDR notation like `192.168.88.1/24`.", 2);
      }
    }

    if (path === "/ip/route" && /\badd\b/.test(trimmed) && /\bdst-address=0\.0\.0\.0\/0\b/.test(trimmed) && !/\bgateway=/.test(trimmed)) {
      addDiagnostic(diagnostics, lineIndex, 0, "Default route is missing `gateway=`.", 1);
    }

    if (path === "/interface/vlan" && /\badd\b/.test(trimmed)) {
      requireToken(line, lineIndex, diagnostics, "vlan-id=", "VLAN interface is missing `vlan-id=`.");
      requireToken(line, lineIndex, diagnostics, "interface=", "VLAN interface is missing parent `interface=`.");
    }

    if (path === "/interface/wireguard/peers" && /\badd\b/.test(trimmed)) {
      requireToken(line, lineIndex, diagnostics, "allowed-address=", "WireGuard peer is missing `allowed-address=`.");
      requireToken(line, lineIndex, diagnostics, "public-key=", "WireGuard peer is missing `public-key=`.");
    }

    if (path === "/routing/bgp/connection" && /\badd\b/.test(trimmed)) {
      requireToken(line, lineIndex, diagnostics, "remote.address=", "BGP connection is missing `remote.address=`.");
      requireToken(line, lineIndex, diagnostics, "remote.as=", "BGP connection is missing `remote.as=`.");
    }

    if (path === "/routing/bgp/peer" && /\badd\b/.test(trimmed)) {
      requireToken(line, lineIndex, diagnostics, "remote-address=", "RouterOS v6 BGP peer is missing `remote-address=`.");
      requireToken(line, lineIndex, diagnostics, "remote-as=", "RouterOS v6 BGP peer is missing `remote-as=`.");
    }

    if (path === "/routing/bgp/peer" && /\b(remote\.address|remote\.as)=/.test(trimmed)) {
      addDiagnostic(diagnostics, lineIndex, 0, "This looks like RouterOS v7 BGP syntax. Under `/routing/bgp/peer`, use v6 fields like `remote-address=` and `remote-as=`.", 2);
    }

    if (path === "/routing/bgp/connection" && /\b(remote-address|remote-as)=/.test(trimmed)) {
      addDiagnostic(diagnostics, lineIndex, 0, "This looks like RouterOS v6 BGP syntax. Under `/routing/bgp/connection`, use v7 fields like `remote.address=` and `remote.as=`.", 2);
    }

    if (path === "/routing/ospf/network" && /\binterfaces=/.test(trimmed)) {
      addDiagnostic(diagnostics, lineIndex, 0, "This looks like RouterOS v7 OSPF syntax. `/routing/ospf/network` is the v6-style section.", 2);
    }

    if (path === "/routing/ospf/interface-template" && /\bnetwork=/.test(trimmed)) {
      addDiagnostic(diagnostics, lineIndex, 0, "This looks like RouterOS v6 OSPF syntax. `/routing/ospf/interface-template` is the v7-style section.", 2);
    }
  }

  if (braceStack.length > 0) {
    const unmatched = braceStack.at(-1);
    addDiagnostic(diagnostics, unmatched.line, unmatched.character, "Unclosed `{` in script block.", 1);
  }

  return diagnostics.slice(0, 100);
}

function trackBracesAndQuotes(line, lineIndex, diagnostics, braceStack) {
  let inString = false;
  let escaped = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (!inString && char === "#") {
      break;
    }

    if (char === "\\" && inString && !escaped) {
      escaped = true;
      continue;
    }

    if (char === "\"" && !escaped) {
      inString = !inString;
    } else if (!inString && char === "{") {
      braceStack.push({ line: lineIndex, character: index });
    } else if (!inString && char === "}") {
      if (braceStack.length === 0) {
        addDiagnostic(diagnostics, lineIndex, index, "Unmatched `}` in script block.", 1);
      } else {
        braceStack.pop();
      }
    }

    escaped = false;
  }

  if (inString) {
    addDiagnostic(diagnostics, lineIndex, Math.max(0, line.length - 1), "Unclosed string literal.", 1);
  }
}

function extractInlinePath(trimmedLine) {
  const match = trimmedLine.match(/^(\/[^\s]+(?:\s+[^\s=:{]+)*)/);
  if (!match) {
    return "";
  }

  const tokens = match[1].split(/\s+/);
  const pathTokens = [];
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (index === 0 && token.startsWith("/")) {
      pathTokens.push(token);
      continue;
    }

    if (isStopToken(token)) {
      break;
    }

    pathTokens.push(token);
  }

  return normalizePath(pathTokens);
}

function isFirewallPath(path) {
  return [
    "/ip/firewall/filter",
    "/ip/firewall/nat",
    "/ip/firewall/mangle",
    "/ip/firewall/raw",
  ].includes(path);
}

function requireToken(line, lineIndex, diagnostics, token, message) {
  if (!line.includes(token)) {
    addDiagnostic(diagnostics, lineIndex, 0, message, 2);
  }
}

function addDiagnostic(diagnostics, line, character, message, severity) {
  diagnostics.push({
    range: {
      start: { line, character },
      end: { line, character: character + 1 },
    },
    severity,
    source: "mikrotik-routeros",
    message,
  });
}

function findIndex(line, token) {
  return Math.max(0, line.indexOf(token));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function reply(id, result) {
  writeMessage({
    jsonrpc: "2.0",
    id,
    result,
  });
}

function replyError(id, code, message) {
  writeMessage({
    jsonrpc: "2.0",
    id,
    error: { code, message },
  });
}

function notifyError(message) {
  notify("window/logMessage", {
    type: 1,
    message,
  });
}

function writeMessage(payload) {
  const body = JSON.stringify(payload);
  stdout.write(`Content-Length: ${Buffer.byteLength(body, "utf8")}\r\n\r\n${body}`);
}

function notify(method, params) {
  writeMessage({
    jsonrpc: "2.0",
    method,
    params,
  });
}

notify("window/logMessage", {
  type: 4,
  message: "RouterOS LSP started",
});
