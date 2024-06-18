---
title: Japanese Input with Fedora 40, Fcitx5, Wayland
date: '2024-06-19'
---

I've been trying to get Japanese input working on Fedora 40 with Wayland.

I found that the "default" ibus-anthy input method works for X11 apps but not as
reliable for Wayland apps.

Overall I get the impression that Fcitx5 is the most future-proof IME at the
moment, with better overall compatibility for both X11 and Wayland.

Unfortunately, I have not figured out how to get Google Chrome and VS Code
working in Wayland mode with IME support yet. So this is not necessarily the
most useful post. But I think it is still good to document my failure for when I
inevitably want to try this again in 6 months.

### References

- https://fedoraproject.org/wiki/I18N/Fcitx5
- https://wiki.archlinux.org/title/Fcitx5
- https://fcitx-im.org/wiki/Install_Fcitx_5
- https://fcitx-im.org/wiki/Setup_Fcitx_5
- https://fcitx-im.org/wiki/Using_Fcitx_5_on_Wayland
- https://zenn.dev/compass/articles/e1f4c88e78b721

### Installation

Install Fcitx5 and the Japanese input method:

```sh
sudo dnf install fcitx5 fcitx5-autostart fcitx5-anthy fcitx5-configtool
```

Note that `fcitx5-autostart` mainly just puts a scripts in your
`/etc/profile.d/` directory like this:

```sh
if [ ! "$XDG_SESSION_TYPE" = "tty" ]   # if this is a gui session (not tty)
then
    # let's use fcitx instead of fcitx5 to make flatpak happy
    # this may break behavior for users who have installed both
    # fcitx and fcitx5, let then change the file on their own
    export INPUT_METHOD=fcitx
    export GTK_IM_MODULE=fcitx
    export QT_IM_MODULE=fcitx
    export XMODIFIERS=@im=fcitx
fi
```

Enable the Kimpanel extension for Gnome:
https://extensions.gnome.org/extension/261/kimpanel/

### Configuration

After restarting my computer, I configured my input settings in the Fcitx5 GUI.

As I have a Japanese layout keyboard, I used the "Select system keyboard layout"
button in the GUI to set my Keyboard, then it seemed to pick that up for both
English and Anthy (IME) mode.

### My failed experience with Google Chrome

For Chrome and Electron Apps, in addition to setting Wayland mode via
`chrome://flags` or via the command line flags:

```
google-chrome --enable-features=UseOzonePlatform --ozone-platform=wayland
```

It is said that you can pass either the flag `--gtk-version=4` or
`--enable-wayland-ime` to get IME features working as well. However, neither was
responsive for me. And `--enable-wayland-ime` literally caused the browser
renderer process to crash. It just doesn't seem worth pursuing further at the
moment.

At the same time, X11 mode is working perfectly. So I guess I will just continue
to use that for now.

Maybe next year it will work?
