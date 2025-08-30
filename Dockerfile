# MyL.Zip Transparent Proxy Container
# This container acts as a transparent proxy layer forwarding requests to zaido.org
# In other deployments, this may serve unique content instead of proxying
FROM nginx:alpine

# Copy authentication and setup files
COPY src/index.html /usr/share/nginx/html/index.html
COPY src/setup-wizard.html /usr/share/nginx/html/setup-wizard.html
COPY src/auth.html /usr/share/nginx/html/auth.html
COPY src/css/ /usr/share/nginx/html/css/
COPY src/js/ /usr/share/nginx/html/js/

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 8080 (Cloud Run requirement)
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
