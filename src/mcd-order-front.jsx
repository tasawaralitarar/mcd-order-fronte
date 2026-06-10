import React, { useState, useEffect } from 'react';

// =========================================================================
// 4. モックモード ＆ スタイリング仕様
// =========================================================================
const useMock = true;

// メニューデータ定義 (1ページ3件表示用ページネーション対応)
const MENU_DATA = [
  { id: 1, name: "ALIクラシックバーガー", price: 480, description: "特製直火焼きパティと新鮮野菜の看板バーガー。", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500" },
  { id: 2, name: "ダブルスパイシーチーズ", price: 580, description: "濃厚チェダーチーズ2枚と旨辛ソースの絶妙な組み合わせ。", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500" },
  { id: 3, name: "クリスピーチキンフィレ", price: 450, description: "外はカリカリ、中はジューシューなチキンパティ。", image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500" },
  { id: 4, name: "メガポテトパニック(L)", price: 390, description: "みんなでシェアできる、カリッと揚げた塩味ポテト。", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500" },
  { id: 5, name: "ALIプレミアムシェイク", price: 280, description: "贅沢バニラビーンズを使用した濃厚な特製シェイク。", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500" },
  { id: 6, name: "アイス黒烏龍茶", price: 200, description: "バーガーによく合う、後味さっぱりのヘルシー茶。", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500" }
];

// インラインスタイル定義
const styles = {
  container: { fontFamily: '"Helvetica Neue", Arial, sans-serif', backgroundColor: '#f4f4f4', minHeight: '100vh', padding: '20px', boxSizing: 'border-box' },
  header: { backgroundColor: '#da291c', color: '#ffbc0d', textAlign: 'center', padding: '20px', borderRadius: '10px', marginBottom: '25px', boxShadow: '0 4px 8px rgba(0,0,0,0.15)' },
  title: { margin: 0, fontSize: '36px', fontWeight: 'bold', letterSpacing: '1px' },
  subtitle: { fontSize: '16px', color: '#ffffff', marginTop: '5px', display: 'block' },
  card: { backgroundColor: '#ffffff', borderRadius: '15px', padding: '30px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', boxSizing: 'border-box' },
  inputGroup: { marginBottom: '25px' },
  label: { display: 'block', fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: '#222' },
  input: { width: '100%', padding: '15px', fontSize: '20px', border: '3px solid #ccc', borderRadius: '8px', boxSizing: 'border-box', outline: 'none', backgroundColor: '#fff' },
  buttonYellow: { backgroundColor: '#ffbc0d', color: '#222', border: 'none', borderRadius: '8px', padding: '18px 30px', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', width: '100%', marginTop: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center' },
  buttonRed: { backgroundColor: '#da291c', color: '#fff', border: 'none', borderRadius: '8px', padding: '18px 30px', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', width: '100%', marginTop: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center' },
  buttonSecondary: { backgroundColor: '#444', color: '#fff', border: 'none', borderRadius: '8px', padding: '14px 24px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', margin: '5px' },
  menuGrid: { display: 'flex', flexDirection: 'column', gap: '20px' },
  menuItemCard: { display: 'flex', border: '2px solid #ddd', borderRadius: '12px', padding: '20px', backgroundColor: '#fff', alignItems: 'center' },
  menuImg: { width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', marginRight: '20px' },
  noImgFallback: { width: '120px', height: '120px', backgroundColor: '#e0e0e0', borderRadius: '8px', marginRight: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', color: '#666', border: '2px dashed #999', fontWeight: 'bold' },
  cartBadge: { backgroundColor: '#da291c', color: '#fff', borderRadius: '50%', padding: '4px 12px', fontSize: '16px', fontWeight: 'bold', marginLeft: '10px' },
  flexBetween: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px', marginTop: '25px' },
  errorBox: { backgroundColor: '#f8d7da', color: '#721c24', padding: '20px', borderRadius: '10px', border: '2px solid #f5c6cb', marginBottom: '20px', fontSize: '20px', textAlign: 'center' },
  successBox: { backgroundColor: '#d4edda', color: '#155724', padding: '35px', borderRadius: '15px', border: '2px solid #c3e6cb', textAlign: 'center' }
};

export default function McdOrderFront() {
  const [screen, setScreen] = useState(0);
  const [serverUrl, setServerUrl] = useState('');
  const [terminalNo, setTerminalNo] = useState('');
  const [cart, setCart] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [imgErrors, setImgErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [orderNo, setOrderNo] = useState('');

  const navigateTo = (nextScreen) => {
    setScreen(nextScreen);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const savedUrl = localStorage.getItem('serverUrl') || '';
    const savedTerminal = localStorage.getItem('terminalNo') || '';
    if (savedUrl && savedTerminal) {
      setServerUrl(savedUrl);
      setTerminalNo(savedTerminal);
      navigateTo(1);
    }
  }, []);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    if (!serverUrl.trim() || !terminalNo.trim()) {
      alert("設定情報を正しく入力してください。");
      return;
    }
    const cleanedUrl = serverUrl.trim().replace(/\/+$/, '');
    const cleanedTerminal = terminalNo.trim();

    localStorage.setItem('serverUrl', cleanedUrl);
    localStorage.setItem('terminalNo', cleanedTerminal);
    setServerUrl(cleanedUrl);
    setTerminalNo(cleanedTerminal);
    navigateTo(1);
  };

  const addToCart = (menuItem) => {
    const existingIndex = cart.findIndex(item => item.menuName === menuItem.name);
    let newCart = [...cart];

    if (existingIndex > -1) {
      if (newCart[existingIndex].quantity >= 5) {
        alert("同じ商品は1回のご注文で5個までとなります。");
        return;
      }
      newCart[existingIndex].quantity += 1;
      newCart[existingIndex].subtotal = newCart[existingIndex].unitPrice * newCart[existingIndex].quantity;
    } else {
      if (cart.length >= 5) {
        alert("一度に注文できる種類は5種類までです。");
        return;
      }
      newCart.push({
        menuName: menuItem.name,
        unitPrice: menuItem.price,
        quantity: 1,
        subtotal: menuItem.price
      });
    }
    setCart(newCart);
  };

  const decreaseQuantity = (menuName) => {
    const index = cart.findIndex(item => item.menuName === menuName);
    if (index === -1) return;

    let newCart = [...cart];
    if (newCart[index].quantity > 1) {
      newCart[index].quantity -= 1;
      newCart[index].subtotal = newCart[index].unitPrice * newCart[index].quantity;
    } else {
      newCart.splice(index, 1);
    }
    setCart(newCart);
  };

  const calcTotalAmount = () => {
    return cart.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const proceedToConfirm = () => {
    if (cart.length === 0) {
      alert("カートに商品が入っていません。");
      return;
    }
    navigateTo(2);
  };

  const submitOrder = async () => {
    const totalAmount = calcTotalAmount();
    const payload = {
      messageType: "ORDER_CONFIRM",
      terminalNo: terminalNo,
      totalAmount: totalAmount,
      items: cart
    };

    if (useMock) {
      console.log("=== [MOCK MODE] API送信電文 ===");
      console.log("送信先URL:", `${serverUrl}/api/orders`);
      console.log("HTTPメソッド: POST");
      console.log("送信JSON(成形):\n", JSON.stringify(payload, null, 2));

      setTimeout(() => {
        const today = new Date();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const mockOrderNo = `${mm}${dd}-001`;

        setOrderNo(mockOrderNo);
        setCart([]);
        navigateTo(3);
      }, 1000);
      return;
    }

    try {
      const response = await fetch(`${serverUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.result === "OK") {
        setOrderNo(data.orderNo);
        setCart([]);
        navigateTo(3);
      } else {
        setApiError(data.message || "注文エラーが発生しました。");
        navigateTo(4);
      }
    } catch (err) {
      setApiError("サーバー通信失敗。URLおよびバックエンドの状態を確認してください: " + err.message);
      navigateTo(4);
    }
  };

  const itemsPerPage = 3;
  const totalPages = Math.ceil(MENU_DATA.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMenuItems = MENU_DATA.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>ALI BURGER SHOPE</h1>
        {terminalNo && <span style={styles.subtitle}>端末番号: {terminalNo} | 接続先: {serverUrl}</span>}
      </header>

      {/* (0) 初期設定画面 */}
      {screen === 0 && (
        <div style={styles.card}>
          <h2 style={{ textAlign: 'center', marginBottom: '25px' }}>端末初期設定</h2>
          <form onSubmit={handleSaveSettings}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>バックエンドURL</label>
              <input style={styles.input} type="text" placeholder="http://127.0.0.1:8080" value={serverUrl} onChange={(e) => setServerUrl(e.target.value)} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>端末番号</label>
              <input style={styles.input} type="text" placeholder="T-01" value={terminalNo} onChange={(e) => setTerminalNo(e.target.value)} />
            </div>
            <button type="submit" style={styles.buttonYellow}>設定を保存して開店</button>
          </form>
        </div>
      )}

      {/* (1) メニュー選択画面 */}
      {screen === 1 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>メニュー ({currentPage} / {totalPages})</h2>
            <button style={{ ...styles.buttonYellow, width: 'auto', margin: 0, padding: '12px 25px' }} onClick={proceedToConfirm}>
              レジに進む <span style={styles.cartBadge}>{cart.reduce((s, i) => s + i.quantity, 0)}</span>
            </button>
          </div>

          <div style={styles.menuGrid}>
            {currentMenuItems.map(item => {
              const itemInCart = cart.find(c => c.menuName === item.name);
              return (
                <div key={item.id} style={styles.menuItemCard}>
                  {imgErrors[item.id] ? <div style={styles.noImgFallback}>画像なし</div> : <img src={item.image} alt={item.name} style={styles.menuImg} onError={() => setImgErrors(prev => ({ ...prev, [item.id]: true }))} />}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>{item.name}</h3>
                    <p style={{ margin: '0 0 10px 0', color: '#555' }}>{item.description}</p>
                    <div style={styles.flexBetween}>
                      <span style={{ fontSize: '26px', fontWeight: 'bold', color: '#da291c' }}>¥{item.price}</span>
                      <div>
                        {itemInCart && <button style={styles.buttonSecondary} onClick={() => decreaseQuantity(item.name)}>-</button>}
                        {itemInCart && <span style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 12px' }}>{itemInCart.quantity}</span>}
                        <button style={{ ...styles.buttonYellow, width: 'auto', margin: 0, padding: '10px 20px' }} onClick={() => addToCart(item)}>＋ カートに入れる</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={styles.pagination}>
            <button style={styles.buttonSecondary} disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}>◀ 前へ</button>
            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{currentPage} / {totalPages}</span>
            <button style={styles.buttonSecondary} disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}>次へ ▶</button>
          </div>
        </div>
      )}

      {/* (2) 注文確認画面 */}
      {screen === 2 && (
        <div style={styles.card}>
          <h2 style={{ textAlign: 'center', color: '#da291c', marginBottom: '25px' }}>ご注文の確認</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '25px', fontSize: '20px' }}>
            <thead>
              <tr style={{ borderBottom: '3px solid #ddd', textAlign: 'left' }}>
                <th style={{ padding: '15px' }}>商品</th>
                <th style={{ padding: '15px', textAlign: 'right' }}>単価</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>数量</th>
                <th style={{ padding: '15px', textAlign: 'right' }}>小計</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px', fontWeight: 'bold' }}>{item.menuName}</td>
                  <td style={{ padding: '15px', textAlign: 'right' }}>¥{item.unitPrice}</td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>{item.quantity}個</td>
                  <td style={{ padding: '15px', textAlign: 'right', fontWeight: 'bold' }}>¥{item.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ ...styles.flexBetween, borderTop: '4px double #999', padding: '20px 0', marginBottom: '25px' }}>
            <span style={{ fontSize: '26px', fontWeight: 'bold' }}>総合計</span>
            <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#da291c' }}>¥{calcTotalAmount()}</span>
          </div>

          <button style={styles.buttonRed} onClick={submitOrder}>【注文確定】注文を送信する</button>
          <button style={{ ...styles.buttonSecondary, width: '100%', padding: '15px', marginTop: '12px' }} onClick={() => navigateTo(1)}>メニューに戻る</button>
        </div>
      )}

      {/* (3) 注文完了画面 */}
      {screen === 3 && (
        <div style={styles.successBox}>
          <h2 style={{ fontSize: '40px', marginBottom: '20px' }}>ご注文受付完了！</h2>
          <p style={{ fontSize: '22px' }}>厨房へオーダーを送信しました。掲示板の番号をお待ちください。</p>
          <div style={{ backgroundColor: '#fff', display: 'inline-block', padding: '25px 50px', borderRadius: '15px', margin: '25px 0', border: '4px solid #ffbc0d' }}>
            <span style={{ fontSize: '18px', color: '#555', display: 'block' }}>お呼び出し番号</span>
            <span style={{ fontSize: '54px', fontWeight: 'bold', color: '#da291c' }}>{orderNo}</span>
          </div>
          <button style={styles.buttonYellow} onClick={() => navigateTo(1)}>次の注文を始める</button>
        </div>
      )}

      {/* (4) エラー画面 */}
      {screen === 4 && (
        <div style={styles.errorBox}>
          <h2>通信エラー</h2>
          <p>{apiError}</p>
          <hr style={{ border: '0', borderTop: '2px solid #f5c6cb', margin: '20px 0' }} />
          <button style={styles.buttonRed} onClick={() => navigateTo(2)}>もう一度送信</button>
          <button style={{ ...styles.buttonSecondary, width: '100%', padding: '15px', marginTop: '12px' }} onClick={() => navigateTo(0)}>設定に戻る</button>
        </div>
      )}
    </div>
  );
}