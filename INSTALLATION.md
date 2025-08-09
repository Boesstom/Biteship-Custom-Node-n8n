# Panduan Instalasi dan Setup n8n-nodes-biteship

## Prasyarat

Sebelum memulai, pastikan Anda memiliki:

1. **Node.js** (versi 16 atau lebih tinggi)
2. **npm** atau **yarn** 
3. **n8n** (versi 0.190.0 atau lebih tinggi)
4. **API Key Biteship** dari [Biteship Dashboard](https://biteship.com/dashboard)

## Langkah 1: Persiapan Environment

### Install n8n (jika belum ada)

```bash
# Install n8n secara global
npm install -g n8n

# Atau install secara lokal
npm install n8n
```

### Dapatkan API Key Biteship

1. Daftar atau login ke [Biteship Dashboard](https://biteship.com/dashboard)
2. Navigasi ke menu **API Keys**
3. Generate API Key baru atau gunakan yang sudah ada
4. Simpan API Key untuk konfigurasi nanti

## Langkah 2: Install Custom Node

### Opsi A: Install dari npm (Belum tersedia)

```bash
npm install n8n-nodes-biteship
```

### Opsi B: Install dari Source Code

```bash
# Clone repository
git clone https://github.com/biteship/n8n-nodes-biteship.git
cd n8n-nodes-biteship

# Install dependencies
npm install

# Build project
npm run build

# Install secara global atau link
npm link
```

### Opsi C: Development Mode

```bash
# Clone dan setup
git clone https://github.com/biteship/n8n-nodes-biteship.git
cd n8n-nodes-biteship
npm install

# Build dalam watch mode
npm run dev

# Di terminal terpisah, jalankan n8n
n8n start
```

## Langkah 3: Konfigurasi n8n

### Environment Variables

Buat file `.env` atau set environment variables:

```bash
# n8n configuration
N8N_CUSTOM_EXTENSIONS_DIR=/path/to/n8n-nodes-biteship
N8N_NODES_INCLUDE=["n8n-nodes-biteship"]

# Optional: untuk development
N8N_NODES_EXCLUDE=[]
```

### Restart n8n

Setelah install custom node, restart n8n:

```bash
# Jika running sebagai service
sudo systemctl restart n8n

# Jika running manual
n8n start
```

## Langkah 4: Setup Credentials di n8n

1. **Buka n8n Interface** di browser (biasanya http://localhost:5678)

2. **Buat Credential Baru**:
   - Klik **Settings** → **Credentials**
   - Klik **Add Credential**
   - Pilih **Biteship API**

3. **Konfigurasi Credential**:
   ```
   Name: Biteship Production (atau nama pilihan Anda)
   API Key: [masukkan API key dari Biteship Dashboard]
   Environment: Production (atau Sandbox untuk testing)
   ```

4. **Test Connection**:
   - Klik **Test** untuk memastikan koneksi berhasil
   - Simpan credential jika test berhasil

## Langkah 5: Membuat Workflow Pertama

### Test Koneksi dengan Get Couriers

1. **Buat Workflow Baru**
2. **Tambahkan Start Node** (otomatis ada)
3. **Tambahkan Biteship Node**:
   - Drag dari node panel atau search "Biteship"
   - Connect ke Start node

4. **Konfigurasi Biteship Node**:
   ```
   Credential: [pilih credential yang telah dibuat]
   Resource: Courier
   Operation: Get All
   ```

5. **Execute Workflow**:
   - Klik tombol **Execute Workflow**
   - Lihat hasil di output panel

### Test Rate Checking

1. **Tambahkan Biteship Node kedua**
2. **Konfigurasi untuk Rate Check**:
   ```
   Resource: Rate
   Operation: Check Rates
   Origin Postal Code: 12345
   Destination Postal Code: 67890
   Couriers: JNE, TIKI
   Items: [tambahkan item dengan nama, berat, dll]
   ```

3. **Execute dan Review Results**

## Troubleshooting

### Node Tidak Muncul di n8n

**Solusi:**
1. Pastikan build berhasil: `npm run build`
2. Check path di `N8N_CUSTOM_EXTENSIONS_DIR`
3. Restart n8n setelah install
4. Check console untuk error messages

### Authentication Failed

**Solusi:**
1. Verifikasi API key di Biteship Dashboard
2. Pastikan environment setting benar (production vs sandbox)
3. Check API key tidak expired
4. Test credential connection di n8n

### API Rate Limit

**Solusi:**
1. Tambahkan delay antar request
2. Gunakan batch processing untuk multiple items
3. Check quota di Biteship Dashboard

### Build Errors

**Solusi:**
```bash
# Clear cache dan rebuild
npm run clean  # jika ada script clean
rm -rf node_modules dist
npm install
npm run build
```

### TypeScript Errors

**Solusi:**
```bash
# Update n8n types
npm update n8n-workflow

# Check TypeScript version
npx tsc --version

# Fix specific errors
npm run lint
npm run lintfix
```

## Development Tips

### Hot Reload Development

```bash
# Terminal 1: Watch mode untuk build
npm run dev

# Terminal 2: n8n dengan auto-restart
nodemon -e js,json --watch dist n8n start
```

### Debugging

1. **Enable Debug Mode**:
   ```bash
   export N8N_LOG_LEVEL=debug
   n8n start
   ```

2. **Check Logs**:
   ```bash
   tail -f ~/.n8n/logs/n8n.log
   ```

3. **Browser DevTools**:
   - Buka Developer Tools di browser
   - Monitor Network tab untuk API calls
   - Check Console untuk JavaScript errors

### Testing Changes

```bash
# Lint code
npm run lint

# Format code
npm run format

# Build production
npm run build

# Test in n8n
n8n start
```

## Next Steps

Setelah berhasil setup:

1. **Explore Workflow Examples** di README.md
2. **Test berbagai operasi** (courier, rate, tracking)
3. **Integrate dengan workflow existing**
4. **Monitor performance** dan error handling
5. **Contribute improvements** ke repository

## Support

Jika mengalami masalah:

1. Check [GitHub Issues](https://github.com/biteship/n8n-nodes-biteship/issues)
2. Review [Biteship API Documentation](https://biteship.com/id/docs/api)
3. Contact support: support@biteship.com
