# Use nginx as a transparent proxy
FROM nginx:alpine

# Copy fallback index.html (in case proxy fails)
COPY src/index.html /usr/share/nginx/html/index.html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 8080 (Cloud Run requirement)
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
