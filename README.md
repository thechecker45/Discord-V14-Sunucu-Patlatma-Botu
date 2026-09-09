<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=700&size=32&pause=1000&color=F75C7E&center=true&vCenter=true&width=600&lines=🚀+Discord+v14+Sunucu+Patlatma;🔥+TheChecker+Tarafından;💀+Tam+Donanımlı+Nuke+Botu" alt="Typing SVG" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Discord.js-v14.14.1-5865F2?style=for-the-badge&logo=discord&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F-red?style=for-the-badge" />
</p>

---

## 👑 Hakkında

Bu Bot Tamamen Benim tarafımdan yazılmıştır. Sadece Readme.md nin yapımında ve kodlarda 1-2 hata konusunda yapay zekadan destek alınmıştır
Onun için Kodun içerisinde yapay zeka görünümü var

Bu bot, Discord sunucularında **tam yetkili nuke/patlatma işlemleri** yapabilen, **slash komut** desteğine sahip, **detaylı log sistemi** bulunan ve **tüm ayarları config.json** üzerinden yönetilen güçlü bir v14 botudur.

**Geliştirici:** [TheChecker](https://thechecker.com.tr)
**Geliştirici DC:** [VIZE](https://discord.gg/sero2k)
---
## ⚙️ Config.json Yapılandırması

Proje kökünde `config.json` dosyası oluştur ve aşağıdaki şablona göre doldur.  
**Her bir ayarın ne işe yaradığı açıklamalarla birlikte verilmiştir.**

```json
{
  // ==================== TEMEL AYARLAR ====================
  "token": "BOT_TOKENIN",              // Discord Bot Token'i (Discord Developer Portal'dan al)
  "sahip": "SENIN_DISCORD_ID_N",        // Bot sahibinin Discord ID'si (yetkili komutlar için)
  "prefix": "+",                        // Komut öneki (örnek: +patlat)

  // ==================== BOT DURUMU ====================
  "botActivity": "Kitty Kat",           // Botun "Oynuyor" durumunda yazacak metin
  "botActivityType": "PLAYING",         // Aktivite türü: PLAYING, WATCHING, LISTENING, COMPETING

  // ==================== PATLAT KOMUTU AYARLARI ====================
  "channelName": "Hacked-By-TheChecker", // +patlat ile oluşturulacak kanalların adı
  "channelCount": 70,                   // Kaç kanal oluşturulacağı

  // ==================== SUNUCU AYARLARI ====================
  "guildName": "Patlatıldı uwu",         // Patlatma sonrası sunucu adı
  "guildIconURL": "https://...",        // Patlatma sonrası sunucu ikonu (URL)

  // ==================== BOT AYARLARI ====================
  "botUsername": "Patlatıldı uwu",       // Patlatma sonrası botun kullanıcı adı
  "botAvatarURL": "https://...",         // Patlatma sonrası botun avatarı (URL)

  // ==================== SPAM KOMUTU ====================
  "spamMessage": "**Ş-şey b-bu sunucusu patlatılmıştır uwu** @everyone :heart:",
  "spamCount": 100,                     // Kaç mesaj spamlanacağı

  // ==================== DM KOMUTU ====================
  "dmMessage": "**Bir sunucu sevilmiştir haberiniz olsun! İYİ GÜNLER :3** :wink:",

  // ==================== KICK / BAN SEBEPLERİ ====================
  "kickReason": "Sunucudan atıldınız.",
  "banReason": "Sunucudan uzaklaştırıldınız.",

  // ==================== ROL KOMUTU ====================
  "roleName": "HACKED",                 // Oluşturulacak rol adı
  "roleColor": "#FF3E00",               // Rol rengi (hex kodu)
  "roleCount": 50,                      // Kaç rol oluşturulacağı

  // ==================== NUKE KOMUTU ====================
  "nukeChannelCount": 50,               // Nuke sonrası kaç kanal oluşturulacağı

  // ==================== YAVAŞ PATLAT KOMUTU ====================
  "yavasChannelCount": 30,              // Yavaş patlatmada kaç kanal oluşturulacağı
  "yavasDelay": 500,                    // Her işlem arası bekleme süresi (milisaniye)

  // ==================== YETKİ KOMUTU ====================
  "adminRoleName": "👑 Admin"           // +yetki ile oluşturulacak admin rol adı
```
```
✨ Özellikler

Komut	Açıklama	Yetki

/patlat	Sunucuyu komple patlatır (kanallar silinir, yenileri açılır, isim/ikon değişir)	Herkes

/ayril	Bot sunucudan ayrılır	Herkes

/kick	Tüm üyeleri kickler	🛡️ Sahip

/dm	Tüm üyelere özel mesaj gönderir	🛡️ Sahip

/yetki	Kendine admin yetkisi verir	Herkes

/ban	Tüm üyeleri banlar	🛡️ Sahip

/rol	50 adet HACKED rolü oluşturur	🛡️ Sahip

/spam	Kanala 100 mesaj spamlar	Herkes


/panel	Admin panelini gösterir	Herkes

/everyone	@everyone'a admin yetkisi verir	Herkes

/nuke	Tüm kanalları silip 50 yeni kanal açar	🛡️ Sahip

/yavaspapatlat	Yavaş ve sessiz patlatma işlemi	🛡️ Sahip

/stop	Tüm komutları geçici olarak durdurur	Herkes

/devam	Durdurulan komutları devam ettirir	Herkes

🛡️ = Sadece bot sahibi kullanabilir.
```
```
🖥️ Konsol Log Sistemi
Bot, her komut için aşağıdaki bilgileri detaylı şekilde konsola basar:

🕒 Zaman damgası (Türkiye saati)

📌 Komut adı

👤 Kullanıcı adı ve ID

🌐 Global ad

🤖 Bot mu? Kullanıcı mı?

🔑 Yetki durumu (Sahip / Yetkisiz)

🏛️ Sunucu ve kanal bilgisi

💬 Mesaj içeriği

📎 Ek dosyalar (varsa)

❌ Hata mesajı ve stack trace (varsa)
```
```
🛠️ Kullanılan Teknolojiler
Discord.js v14 - Discord API

Node.js - JavaScript Runtime

REST API - Slash komut kaydı
```
```
📦 Kurulum
bash
# Repoyu klonla
git clone https://github.com/kullaniciadin/discord-v14-patlatma-botu.git
cd discord-v14-patlatma-botu
```
```
# Bağımlılıkları yükle
npm install

# Botu çalıştır
node .
```
📜 Lisans
Bu proje MIT Lisansı ile lisanslanmıştır.
Dilediğin gibi kullan, değiştir, paylaş.

<p align="center"> <b>⭐ Beğendiysen yıldız vermeyi unutma! ⭐</b> </p>
