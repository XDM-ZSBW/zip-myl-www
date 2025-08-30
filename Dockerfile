# Use nginx to serve static files
FROM nginx:alpine

# Copy the static files to nginx's default serving directory
COPY src/ /usr/share/nginx/html/

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 8080 (Cloud Run requirement)
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
