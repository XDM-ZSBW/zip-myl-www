# MyL.Zip Transparent Proxy Container
# This container acts as a transparent proxy layer forwarding requests to zaido.org
# In other deployments, this may serve unique content instead of proxying
FROM nginx:alpine

# Copy fallback index.html (in case proxy fails)
COPY src/index.html /usr/share/nginx/html/index.html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 8080 (Cloud Run requirement)
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
