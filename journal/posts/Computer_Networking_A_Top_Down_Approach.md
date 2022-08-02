---
title: Computer Networking A Top Down Approach
description: Notes dump from the book
tags: ['networking']
timestamp: 1659356988835
---

# Computer Networking: A Top Down Approach

[[toc]]

## HTTP Protocol

The HTTP protocol (application layer) works on top of the TCP protocol (Transport Layer). Characteristics of TCP protocol:

- Ensures reliable data transfer
- Requires a connection to be established

Establishing a connection means that TCP protocol requires client-server to exchange transport-layer control information _before_ application level messages begin to flow. This is also known as the 'handshaking' procedure which occurs before the exchange of application messages. After a successful handshaking phase, a **TCP Connection** is said to exist between client-server. The connection is a full-duplex connection in that two applications (processes) can send messages to each other over the connection at the same time.

A HTTP request-response involves a 3-way handhake. The following shows what happens on both the HTTP and TCP layers when a user requests ofr a web page:

1. Client initiates handshaking procedure by sending a TCP segment
2. Server acknowledges receipt and responds with a TCP segment
3. Client acknowledges receipt and responds with a TCP segment (marking the end of 3-way handshake). This last acknowledgement is sent together with the HTTP request.
4. Finally, the server sends over the HTTP response with web page data.
5. The TCP connection may terminate, depending on whether the TCP connection is persisted.

The duration of entire exchange is roughly the sum of:

- 2x RTT (Round Trip Time, the time it takes for a packet to travel to server and back)
- The time it takes for server to transmit web page data

### HTTP with Persistent Connections

When an HTTP request is made for the first time, a TCP connection is first established before HTTP messages are exchanged. With persistent connections, the server leaves the TCP connection open after sending a response. Subsequent requests and responses between the same client-server can be sent over the same connection. Typically, the server closes the TCP connection when it isn't used for a certain amount of time. Persistent connections are possible in HTTP 1.1, and is the default operating mode.

HTTP/1.1 persistent connections also supports _pipelining_, which allows the client to fire requests back-to-back, without needing to wait for responses of previous requests. See [here](https://stackoverflow.com/a/36437932/5204647) for HTTP/1.1 pipelining vs HTTP/2 multiplexing. Because HTTP/1.1 requires responses to be sent in order, it can be prone to Head of Line Blocking; but this isn't the case for HTTP/2.

![pipelining vs. no pipelining](https://engineering.salesforce.com/wp-content/uploads/2022/04/1_H_KToW3hIhbSNjDktKtwJQ.png)

### HTTP over multiple TCP Connections

In a context where pipelining/multiplexing isn't possible (in a pre-HTTP/1.1 world), a workaround to enhance performance is to open multiple TCP connections. If a user requests for 10 web objects, the browser could open multiple TCP connections and fire HTTP requests _in parallel_. This offers better performance than having to chain request-response _in series_.

<PostDate />
<PageTags />
