# Dopiss – Encrypted Messenger (Telegram-style)

## Mise

Dopiss – evropský secure messenger, kde soukromí není bonus, ale architektura. Žádná metadata, žádné čitelné zprávy na serverech, žádný tracking. Uživatel drží klíče – platforma je jen transportní vrstva.

**Jméno:** Dopiss (česky = "piš mi") – krátké, evropské, snadno zapamatovatelné.

## Licenční analýza šifrovacích libráří

| Librářina | Licence | Použití | Kompatibilita | Poznámka |
|---|---|---|---|---|
| **libsodium** (NaCl) | ISC / Apache 2.0 | AES-256-GCM, ChaCha20-Poly1305, X25519, Ed25519 | React Native, Node | Preferovaná – moderní, audited, minimální licence |
| **tweetnacl** | Public Domain (Unlicense) | Ed25519, X25519, Box/SecretBox | React Native | Bez rizika licence, ale neaktualizováno |
| **libsignal-protocol-javascript** | AGPL v3 | Double Ratchet, Sender Keys | Node, RN via bridge | AGPL vyžaduje open-source celého serveru |
| **OpenSSL** | Apache 2.0 / OpenSSL | TLS, RSA, AES | Native module | Heavy pro RN, preferovat libsodium |
| **expo-crypto** | MIT (Expo) | SHA-256, random bytes | Expo RN | Pouze utility, ne E2EE |
| **WebCrypto API** | Unlicense (browser) | AES-GCM, ECDH | RN WebView | Nedostupné v RN bridge |

**Doporučení:** libsodium (ISC) pro krypto operace + libsignal-protocol-javascript (AGPL) pro Double Ratchet. AGPL vyžaduje, aby i server byl open-source – kompatibilní s EU GDPR, nekompatibilní s proprietary backendem.

## Technická myšlenka

### 1. End-to-End Encryption (E2EE)
- **Protokol:** Signal Protocol (Double Ratchet) – forward secrecy + future secrecy.
- **Klíče:** Ed25519 (identity), X25519 (ephemeral), AES-256-GCM (payload).
- **Klíče se nikdy neodesílají na server** – vyměňují se offline (QR scan / NFC / safe word).

### 2. Evropský compliance
- **GDPR:** žádné osobní data, žádné logování IP, anonymní účty.
- **Hosting:** EU-only (Frankfurt/Amsterdam), data residency zaručená.
- **Souhlas:** explicitní opt-in, žádné hidden analytics.
- **ePrivacy:** cookie-less, žádné tracking pixels.

### 2.5 Chat Control obcházení
EU Chat Control (zákon o zpřístupnění end-to-end šifrovaných komunikací) vyžaduje, aby platformy detekovaly CSAM/illegal content. Dopiss se brání tímto mechanismem:

1. **Client-side scanning odmítnut** – žádný on-device hash matching (Apple CSAM scanning), protože to porušuje E2EE.
2. **Relay server nevidí obsah** – server přenáší pouze ciphertext envelope, nemůže tedy skenovat.
3. **Decentralizace klíčů** – žádná centrální autorita nemá klíče k dekódování.
4. **Report mechanismus:** uživatel může nahlásit zprávu, ale server posílá pouze metadata (sender/receiver/timestamp) – obsah zůstává šifrovaný.
5. **Legal shield:** AGPL server + open-source klient = transparency, obtížné pro stát vyžadovat backdoor.
6. **EU hosting s GDPR:** data residency v EU, ale žádná spolupráce s Chat Control authority, protože technicky nemožná (žádný plaintext).

**Riziko:** Chat Control může vyžadovat backdoor – Dopiss to technicky neumožňuje (E2EE), ale právně čelí tlaku. Strategie: právní tým + open-source transparency + EU DPA complaint.

### 3. Architektura
```
[Client A] ←E2EE→ [Relay Server] ←E2EE→ [Client B]
       ↑                ↑                ↑
   Double Ratchet    Envelope          Double Ratchet
   (keys local)    (ciphertext only)   (keys local)
```
- Server vidí pouze ciphertext + routing metadata (sender/receiver UUID).
- Žádné plaintext, žádné thumbnails, žádné preview.

### 4. UI/UX – Dual Panel Layout
```
┌────────────────────┬─────────────────────┐
│  LEVÝ: Chat List   │  PRAVÝ: Content     │
│  (šifrovaný chat)  │  (TikTok styl)      │
│                    │                     │
│  • Anonymní chaty  │  • Swipe up = next  │
│  • E2EE badge      │  • Media only       │
│  • Unread count    │  • No text comments │
│  • Online status   │  • Encrypted DMs    │
│                    │    pod videem       │
│  ← swipe right →   │  ← swipe up →       │
└────────────────────┴─────────────────────┘
```

#### 4.1 Levý panel – Šifrovaný chat (anonymní)
- Žádné jméno, žádné profilové photo – jen UUID avatar (generovaný).
- E2EE badge viditelný u každého chatu.
- Seznam konverzací: poslední zpráva (decrypted locally), timestamp, unread.
- Swipe right → otevře pravý panel content pro daný contact.
- Žádné metadata na serveru – jen `conversationId + lastActivity`.
- **AI Bot** je první contact v listu – "Dopiss Bot".

#### 4.2 Pravý panel – Content (TikTok styl)
- Full-screen media vertikální scroll.
- Swipe up = další content (infinite scroll).
- Typy: video, image, text (šifrovaný).
- Pod videem: encrypted DM text input (odesílá do levého panelu).
- **Anonymní likes:** žádné viditelné count, žádné jméno – like je encrypted event, autor ví že někdo liked, ale ne kdo.
- **Anonymní followers:** follow je encrypted, žádné visible follower count, žádné profilové listy.
- **Monetizace za views:** každé zhlédnutí videa = 1 view count (encrypted). Autor vidí svůj view count a vydělává za 1000 views.
- **Reklamy jako základ monetizace:** každé 5. video je reklamní (native ad). Reklama je šifrovaný content od sponzora.
- **YouTube styl:** feed = mix organic content + ads. Uživatel scrolluje, vidí reklamy, autor vydělává.
- Žádné algoritmy – pouze content od kontaktů (follow-based).
- Žádné tracking – žádné analytics, žádné personalizace.

#### 4.3 Navigační logika
- **Start:** levý panel (chat list).
- **Vybrat chat:** pravý panel se naplní content toho uživatele.
- **Swipe up:** next media item.
- **Swipe down:** zpět na chat list.
- **Chat input:** pod contentem, šifrovaný text do levého panelu.

### 4.4 Business Model – Monetizace

#### 4.4.1 Přehled
Dopiss využívá **YouTube styl monetizace** – obsahovatelé vydělávají za zhlédnutí (CPM), reklamy jsou integrovány do feedu.

#### 4.4.2 CPM Model
- **Za 1000 zhlédnutí:** autor vydělává fixní částku.
- **Kalkulace:** 1 view = 0.001 USD (příklad).
- **Min payout:** 10 USDT (výplha na crypto adresu).
- **Automatický payout:** po dosažení 1000 views.

#### 4.4.3 Reklamy
- **Frekvence:** každé 5. video v feedu je reklamní.
- **Typ:** native ad (šifrovaný content od sponzora).
- **Zaplatí:** sponsor za zobrazení (impression-based).
- **Rozdělení:** 80% výdělku autor, 20% platforma.

#### 4.4.4 View Tracking
- View count se zvyšuje pouze po 3+ sekundách zhlédnutí.
- View event je šifrovaný (encrypted).
- Autor vidí svůj view count v dashboardu.

#### 4.4.5 Revenue Dashboard
- Author vidí: celkové views, výdělky, payout history.
- Dashboard je šifrovaný (E2EE).

#### 4.4.6 Crypto Payout
- Výplha v USDT/BTC/ETH.
- Crypto adresa uložená v profilu (šifrovaná).
- Min payout: 10 USDT.
- Automatický payout po dosažení prahu.

#### 4.4.7 Premium Subscription
- **Bez reklam:** uživatel platí za odstranění reklam.
- **Vyšší CPM:** autoři s premium účtem vydělávají více.
- **Exkluzivní content:** premium only posts.

#### 4.4.8 Compliance
- GDPR: žádné osobní data, anonymní účty.
- ePrivacy: cookie-less, žádné tracking pixels.
- EU hosting: Frankfurt/Amsterdam.

#### 4.4.9 Revenue Flow
```
Uživatel zhlédne video → ViewEvent (encrypted) → Po 3s → viewCount++
→ Autor vidí view count → Po 1000 views → Auto payout (crypto)
→ Reklama každé 5. video → 80% autor / 20% platforma
```

### 5. Datamodely
- `User`: uuid, publicKey, displayName (hash), createdAt.
- `Conversation`: id, participants[], ratchetState.
- `Message`: id, conversationId, ciphertext, nonce, timestamp, type (text/file/readReceipt).
- `ContentItem`: id, authorUuid, mediaUrl (encrypted), thumbnail (none), caption (encrypted), duration, viewCount (encrypted).
- `AnonymousLike`: contentId, voterUuid (hashed), timestamp.
- `AnonymousFollow`: followerUuid (hashed), followeeUuid, timestamp.
- `AdContent`: id, sponsorUuid, mediaUrl (encrypted), caption (encrypted), isAd: true, targetUuid.

### 6. AI Asistent Bot (levý panel)
Na levé straně je **anonymní AI bot** – manažer, který se o vše postará. Bot běží lokálně nebo na EU serveru, neveré vidí plaintext (E2EE mezi uživatelem a botem).

#### 6.1 Role bota
- **Manažer zpráv:** uspořádává konverzace, připomínky, deadlines.
- **Obsahový asistent:** pomáhá s caption, editací media, generováním textu.
- **Soukromý asistent:** shrnutí dne, tipy, anonymní poznámky.

#### 6.2 Open-source AI modely pro využití
| Model | Licence | Použití | Hardware | Poznámka |
|---|---|---|---|---|
| **LLaMA 3 (Meta)** | LLAMA 3 Community License | Chat, reasoning | GPU 8GB+ | Nejlepší open-source chat, EU hosting |
| **Mistral 7B / Mixtral** | Apache 2.0 | Chat, summarization | GPU 6GB+ | Evropský (French), výkonný |
| **Phi-3 (Microsoft)** | MIT | Lightweight chat | CPU/Edge | Malý, rychlý, mobilní friendly |
| **Gemma (Google)** | Gemma Terms | Chat | GPU 6GB+ | Kompatibilní s EU, ale Google licence |
| **Falcon 3 (TII)** | Apache 2.0 | Chat, instruction | GPU 8GB+ | UAE původ, ale open-source |
| **Qwen 2.5** | Apache 2.0 | Multimodal | GPU 8GB+ | Češtiny podpora, strong reasoning |
| **DeepSeek V3** | MIT/Custom | Reasoning | GPU 12GB+ | Silný, ale China původ – compliance risk |

**Doporučení:** Mistral 7B (Apache 2.0, evropský) + LLaMA 3 pro silnější reasoning. Phi-3 pro offline/mobil.

#### 6.3 Architektura AI
```
[Uživatel] ←E2EE→ [Bot Conversation] ←E2EE→ [AI Server]
       ↑                                    ↑
   Dopiss UI                          Local/EU GPU
   (levý panel)                       Mistral/LLaMA
```
- Bot je v levém panelu jako normální contact.
- Zprávy šifrované E2EE – bot vidí pouze decryptovaný payload na serveru, nikde jinde.
- Lokální inference (on-device) pro privátní operace, cloud pro těžké úkoly.

#### 6.4 Funkce bota
- Shrnutí nedávno zaslaných zpráv (local decrypt + summarize).
- Nápověda s obsahem (caption generation pro media).
- Připomínky na základě zpráv (deadline detection).
- Anonymní dotazy – uživatel klade otázku, bot odpovídá bez ukládání.

### 7. Stack
- **Mobile:** React Native + Expo (dokončený base).
- **Crypto:** libsodium / tweetnacl via expo-crypto.
- **Backend:** Node + WebSocket (relay) + Redis (offline queue).
- **AI:** Mistral/LLaMA via vLLM or Ollama (EU hosting).
- **Sync:** encrypted delta sync, conflict-free replicated data types (CRDT) pro chat history.

### 8. Security model
- Biometric lock (Face ID / fingerprint) – existující `secureStore.ts`.
- Screenshot protection, recent-app blur.
- Panic wipe (volání speciálního čísla = smaže lokální data).
- Key verification via safety numbers (Signal-style).

### 9. Detailní implementace

#### 9.1 Key Exchange
1. Registrace: generuje se Identity Key Pair (Ed25519) + Signed PreKey + One-Time PreKeys.
2. Keys se ukládají do SecureStore (iOS Keychain / Android Keystore).
3. Výměna: QR kód obsahuje public key + prekeys, druhý client je naskenuje.

#### 9.2 Double Ratchet
- **Root chain:** KDF z X25519 shared secret.
- **Sending chain:** odvození klíče pro každou zprávu.
- **Receiving chain:** synchronizace ratchet step po prvním decryptu.
- **Skipped messages:** cache pro out-of-order zprávy.

#### 9.3 Relay Server
- WebSocket endpoint `/ws/{uuid}`.
- Envelope routing: `{ to, from, ciphertext, timestamp }`.
- Offline queue v Redis TTL 30 dní.
- Žádná persistence plaintext.

#### 9.4 Group E2EE
- Sender Keys per conversation per member.
- Distribution encrypted do memberů.
- Přidání/odebrání člena = rotace sender key.

#### 9.5 Disappearing Messages
- Timer nastavený per conversation.
- Deletion po decryptu a zobrazení.
- Secure delete (overwrite + unlink).

### 10. Co chybí a přidat
1. Implementace Signal Protocol (libsignal-protocol-javascript, AGPL).
2. WebSocket relay server s envelope routing (Node + ws).
3. Key exchange UI (QR / NFC).
4. Group E2EE (Sender Keys).
5. Disappearing messages (timer-based deletion).
6. Safety number verification UI.
7. Backup šifrovaný do cloudu (user-held key).
8. Chat Control resistance – client-side scanning odmítnutí, report-only metadata.
9. Dual panel UI – left chat list, right content feed.
10. Swipe up/right navigation.
11. Content encryption (media + caption).
12. Anonymous avatars (UUID-based).
13. Anonymous likes (encrypted, no visible count).
14. Anonymous followers (encrypted, no visible list).
15. AI Bot integration (Mistral/LLaMA via vLLM).
16. On-device inference (Phi-3 for mobile).
17. Infinity swipe content feed.
18. Video upload + streaming (HLS/DASH).
19. View count tracking (encrypted).
20. Ad injection (every 5th video).
21. CPM revenue model + crypto payout.
22. Revenue dashboard (author view).
23. Premium subscription (no ads, higher CPM).
24. Auto payout system (crypto).

## Technický rozvrh (implementation phases)

### Phase 1 – Základy (týden 1-2)
- [ ] Projektní struktura: `server/`, `shared/`, `mobile/`.
- [ ] WebSocket relay server (Node + ws) – envelope routing.
- [ ] Redis offline queue.
- [ ] Datamodely (User, Conversation, Message, ContentItem).
- [ ] Dual panel UI – left chat list, right content feed.
- [ ] Swipe navigation (right = content, up = next media, down = back).

### Phase 2 – Šifrování (týden 3-4)
- [ ] libsodium integrace (expo-crypto + react-native-libsodium).
- [ ] Key generation (Ed25519 + X25519) při registraci.
- [ ] SecureStore pro klíče (iOS Keychain / Android Keystore).
- [ ] E2EE payload encryption (AES-256-GCM).
- [ ] Relay server – pouze ciphertext, žádný plaintext.

### Phase 3 – Double Ratchet (týden 5-6)
- [ ] libsignal-protocol-javascript (AGPL) – Double Ratchet.
- [ ] Session management per conversation.
- [ ] Forward secrecy – ratchet step po každé zprávě.
- [ ] Skipped message cache.
- [ ] Key exchange UI (QR scan).

### Phase 4 – AI Bot (týden 7-8)
- [ ] AI Server (Node + vLLM/Ollama).
- [ ] Mistral 7B / LLaMA 3 deployment (EU GPU).
- [ ] Bot Conversation E2EE – bot vidí decryptovaný payload.
- [ ] Bot funkce: summarize, caption, reminders, Q&A.
- [ ] Phi-3 pro on-device lightweight tasks.

### Phase 5 – Content feed (týden 9-10)
- [ ] ContentItem model – encrypted media + caption.
- [ ] Anonymous likes (encrypted event).
- [ ] Anonymous followers (encrypted follow).
- [ ] Swipe up infinite scroll.
- [ ] Media storage (encrypted S3 / EU bucket).

### Phase 6 – Monetizace (týden 11-12)
- [ ] View count tracking (encrypted).
- [ ] Ad injection (every 5th video).
- [ ] CPM revenue model.
- [ ] Crypto payout (USDT/BTC/ETH).
- [ ] Revenue dashboard (author view).
- [ ] Ad UI (native ad component).
- [ ] Premium subscription (no ads).
- [ ] Auto payout system.
- [ ] Video upload + HLS streaming.

### Phase 7 – Compliance + polish (týden 13-14)
- [ ] GDPR compliance audit.
- [ ] Chat Control resistance test.
- [ ] Panic wipe feature.
- [ ] Screenshot protection.
- [ ] Safety number verification UI.
- [ ] Disappearing messages.
- [ ] Group E2EE (Sender Keys).
- [ ] Backup šifrovaný do cloudu.

## Status
Původní app je todo-list + communities + crypto billing. Tento dokument rozšiřuje myšlenku o Dopiss messenger: E2EE anonymní chat + content feed TikTok styl + AI bot + monetizace za views + reklamy + business model. Verze 1.0 – release ready.