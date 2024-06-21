---
title: JavaScript in Shared Hosting (and CGI and FastCGI)
date: '2024-06-22'
---

I don't know so much about PHP and shared hosting, but after being tasked to help with my friend's Wordpress site, I've been getting a little more into it this week.

While I am used to Vercel, Netlify, Cloudflare Workers and Docker, I've never used a shared hosting service before. It turns out that Shared Hosting in Japan is extremely cheap, and you get access the full array of applications that can run on a server.

The first shared hosting I found was called [Lolipop](https://lolipop.jp/). You can get a so-called "Economy" shared hosting plan for as low as 100 yen per month! (That's about $0.63 USD at current exchange rates.) It's ridiculously cheap. However, this so called "Economy" plan turned out to be too limited. I wanted to try running Node, Bun and Deno, but the server turned out to be running CentOS 7, and the max glibc version was too low for any of these modern binaries. Also, this plan had no SSH access. It was simply too hard to do anything interesting.

After some research, I found another provider called [Coreserver](https://coreserver.jp/). Their CORE-MINI plan is as low as 220 yen per month but you get:

-   FastCGI
-   SSH access
-   MySQL database
-   Postgres database
-   Email accounts

Weirdly enough, this company is also under the same [GMO](https://www.gmo.jp/en/) umbrella corp as Lolipop. I don't know why they have so many overlapping businesses.

And to sweeten the deal, Coreserver seems to have recently refreshed their machines, and are running AlmaLinux 8. It can run any modern software without issues.

So first of all I started experimenting with CGI.

It turns out you can even run JavaScript as CGI. Inspired by [CGI-Node](https://www.cgi-node.org/), I combine [Hono](https://hono.dev/) with a special entry point to run it as a CGI script and print the response to stdout.

It's kind of cool, I could imagine writing simple scripts in JavaScript in a similar fashion to PHP. And, especially, if I can get Bun or Deno running, I could even use JSX for server side rendering without needing a compile step. I also like the scalability of this, that the server could spawn instances as needed, and it can scale down to 0 instances if there is no traffic.

However, it is said that CGI is slow because it has to start up a process for each request. It's believable. I found that a Go-based hello world CGI takes around 40ms, and a Bun-based hello world CGI takes around 100~500ms to respond.

Okay, on to FastCGI. So, the new shared hosting advertises FastCGI in the context of PHP support. But I checked and it seems that the FastCGI (mod_fcgid) module is just enabled on my shared hosting's Apache server, free to use for any FastCGI application you like. (Hopefully I won't get banned...)

FastCGI, and in particular, the Apache integration, mod_fcgid, is interesting because it will reuse the same process, and it will automatically spawn and scale up your app and scale it down to 0! That's amazing! This is actually a very similar execution model to something like Cloudflare Workers.

The protocol seems weird, though. As far as I can tell, it's very similar to real HTTP protocol. Why not just use HTTP? The support for it is also very bad across the board, except maybe PHP and [Go](https://pkg.go.dev/net/http/fcgi). Why hasn't someone made a remix of `mod_fcgid` that does the same process management but uses plain HTTP protocl instead of FastCGI protocol? This could be amazing for low and medium traffic sites. Not everyone needs docker or processes that run 24h a day.

You can write a FastCGI application in Go very easily using just the standard library:

```go
// hello_fcgi.go
package main

import (
	"fmt"
	"log"
	"net/http"
	"net/http/fcgi"
)

func helloWorld(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Hello, World!")
}

func main() {
	// Serve FastCGI requests
	err := fcgi.Serve(nil, http.HandlerFunc(helloWorld))
	if err != nil {
		log.Fatal("Error serving FastCGI:", err)
	}
}
```

After the server warms up, it responds to requests in around 20ms! Double the speed of the CGI version.

So, I've been able to confirm the server can run FastCGI and the response speed is extremely reasonable. But here is where I have gotten stuck. The fastci libraries for Node do not look so great. The most promising one I found, `node-fastcgi`, turns out to have some weird imcompatibilities with Bun too. Bun also does not seem to support creating a server that binds to `stdin` (representing a unix socket), which is necessary for Apache to use FastCGI via mod_fcgid.

So, I am debating how to proceed from here. I might switch to Node, or maybe use Go to proxy requests to the Bun server. Hopefully I can write a Part II someday!
