# ETHS
Tool to download __1000__ latest contracts from etherscan.io, script was written in Node.js

# Install

```bash
npm i -g eths
```

# Usage

```bash
eths address # used to download addresses
eths contract # read address from `address.txt` to download contract source code.
```

__Notice__: run `eths address` before `eths contract`

# Other options

Put `//` or `#` in front of address in `address.txt` file to ignore that address. for examples:
```bash
0x897878787879
# 0x11223344555
```
`eths` will download contract `0x897878787879` only


