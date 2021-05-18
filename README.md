Handwritten digit recognition using different Machine Learning techniques, trained using the MNIST handwritten digit database.

The Application is written in Flask using the Sklearn library. It runs over a Nginx server.

To use it, launch the container with:

```docker run -p host_port:80 -d juangonzalezcaminero/digit_recognition host_ip```

And it will become available on host_ip:host_port. It can be accessed with any modern browser.
