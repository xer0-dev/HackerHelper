from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
from core import vulnerability, network, encryption, reconnaissance
import json

class MyServer(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)

        if self.path == '/vulnerability/xss':
            url = data.get('url')
            self.send_response(200)
            self.end_headers()
            self.wfile.write(vulnerability.xss_check(url).encode())

        elif self.path == '/vulnerability/csrf':
            url = data.get('url')
            self.send_response(200)
            self.end_headers()
            self.wfile.write(vulnerability.csrf_token_check(url).encode())

        elif self.path == '/vulnerability/clickjacking':
            url = data.get('url')
            self.send_response(200)
            self.end_headers()
            self.wfile.write(vulnerability.clickjacking_check(url).encode())

        elif self.path == '/vulnerability/sql-injection':
            url = data.get('url')
            self.send_response(200)
            self.end_headers()
            self.wfile.write(vulnerability.sql_injection_check(url).encode())

        elif self.path == '/vulnerability/ssl-tls':
            url = data.get('url')
            self.send_response(200)
            self.end_headers()
            self.wfile.write(vulnerability.ssl_tls_check(url).encode())

        elif self.path == '/vulnerability/fully-vuln-scan':
            url = data.get('url')
            scanner = libwapiti.WapitiScanner(url)
            self.send_response(200)
            self.end_headers()
            self.wfile.write(scanner.scan().encode())

        elif self.path == '/network/http-enum':
            target = data.get('target')
            self.send_response(200)
            self.end_headers()
            self.wfile.write(network.http_enum(target).encode())

        elif self.path == '/network/ssl-enum':
            target = data.get('target')
            port = data.get('port')
            self.send_response(200)
            self.end_headers()
            self.wfile.write(network.ssl_enum(target, port).encode())

        elif self.path == '/network/dns-brute':
            domain = data.get('domain')
            self.send_response(200)
            self.end_headers()
            self.wfile.write(network.dns_brute(domain).encode())

        elif self.path == '/network/smb-enum':
            target = data.get('target')
            self.send_response(200)
            self.end_headers()
            self.wfile.write(network.smb_enum(target).encode())

        elif self.path == '/network/mysql-enum':
            target = data.get('target')
            port = data.get('port')
            self.send_response(200)
            self.end_headers()
            self.wfile.write(network.mysql_enum(target, port).encode())

        elif self.path == '/network/nmap-scan':
            target = data.get('target')
            scan_types = data.get('scan_types')
            ports = data.get('ports')
            arguments = data.get('arguments')
            self.send_response(200)
            self.end_headers()
            self.wfile.write(network.nmap_scan(target, scan_types, ports, arguments).encode())

        elif self.path == '/encryption/generate-key-pair-ecdsa':
            self.send_response(200)
            self.end_headers()
            self.wfile.write(encryption.generate_key_pair_ecdsa().encode())

        elif self.path == '/encryption/sign-ecdsa':
            private_key = data.get('private_key')
            message = data.get('message')
            self.send_response(200)
            self.end_headers()
            self.wfile.write(encryption.sign_ecdsa(private_key, message).encode())

        elif self.path == '/encryption/verify-ecdsa':
            public_key = data.get('public_key')
            message = data.get('message')
            signature = data.get('signature')
            self.send_response(200)
            self.end_headers()
            self.wfile.write(encryption.verify_ecdsa(public_key, message, signature).encode())

        elif self.path == '/encryption/encrypt-file':
            file_path = data.get('file_path')
            key = data.get('key')
            self.send_response(200)
            self.end_headers()
            self.wfile.write(encryption.encrypt_file(file_path, key).encode())

        elif self.path == '/encryption/decrypt-file':
            file_path = data.get('file_path')
            key = data.get('key')
            self.send_response(200)
            self.end_headers()
            self.wfile.write(encryption.decrypt_file(file_path, key).encode())

        elif self.path == '/encryption/generate-key-pair-ecdh':
            self.send_response(200)
            self.end_headers()
            self.wfile.write(encryption.generate_key_pair_ecdh().encode())

        elif self.path == '/encryption/generate-hmac':
            key = data.get('key')
            message = data.get('message')
            self.send_response(200)
            self.end_headers()
            self.wfile.write(encryption.generate_hmac(key, message).encode())

        elif self.path == '/encryption/verify-hmac':
            key = data.get('key')
            message = data.get('message')
            hmac = data.get('hmac')
            self.send_response(200)
            self.end_headers()
            self.wfile.write(encryption.verify_hmac(key, message, hmac).encode())

        elif self.path == '/encryption/generate-totp':
            secret = data.get('secret')
            self.send_response(200)
            self.end_headers()
            self.wfile.write(encryption.generate_totp(secret).encode())

        elif self.path == '/encryption/verify-totp':
            secret = data.get('secret')
            token = data.get('token')
            self.send_response(200)
            self.end_headers()
            self.wfile.write(encryption.verify_totp(secret, token).encode())

        elif self.path == '/recon/whois':
            domain = data.get('domain')
            self.send_response(200)
            self.end_headers()
            self.wfile.write(reconnaissance.advanced_whois_lookup(domain).encode())

        elif self.path == '/recon/shodan':
            query = data.get('query')
            self.send_response(200)
            self.end_headers()
            self.wfile.write(reconnaissance.comprehensive_shodan_search(query).encode())

        elif self.path == '/recon/censys':
            query = data.get('query')
            self.send_response(200)
            self.end_headers()
            self.wfile.write(reconnaissance.multi_source_censys_search(query).encode())

        elif self.path == '/recon/google-dork':
            domain = data.get('domain')
            dorks = data.get('dorks')
            self.send_response(200)
            self.end_headers()
            self.wfile.write(reconnaissance.advanced_google_dork_search(domain, dorks).encode())

        elif self.path == '/recon/technology-detection':
            url = data.get('url')
            self.send_response(200)
            self.end_headers()
            self.wfile.write(reconnaissance.comprehensive_technology_detection(url).encode())

        elif self.path == '/recon/email-harvest':
            domain = data.get('domain')
            self.send_response(200)
            self.end_headers()
            self.wfile.write(reconnaissance.advanced_email_harvesting(domain).encode())

        elif self.path == '/recon/domain-info':
            domain = data.get('domain')
            self.send_response(200)
            self.end_headers()
            self.wfile.write(reconnaissance.comprehensive_domain_info(domain).encode())

        elif self.path == '/recon/ssl-info':
            domain = data.get('domain')
            self.send_response(200)
            self.end_headers()
            self.wfile.write(reconnaissance.advanced_ssl_info(domain).encode())

        elif self.path == '/recon/subdomain-enum':
            domain = data.get('domain')
            self.send_response(200)
            self.end_headers()
            self.wfile.write(reconnaissance.comprehensive_subdomain_enumeration(domain).encode())

def run():
    print('Starting server...')
    server_address = ('', 3001)
    httpd = HTTPServer(server_address, MyServer)
    print('Server is running...')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('\nClosing server...')
        httpd.server_close()
        print('Server closed.')

run()