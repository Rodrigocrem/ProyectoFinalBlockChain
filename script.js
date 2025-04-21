const connectButton = document.getElementById('connectButton');
const userAddressDisplay = document.getElementById('userAddress');
const mintForm = document.getElementById('mintForm');
const status = document.getElementById('status');

let signer;
let contract;

// 👉 Reemplaza con tu dirección real del contrato en Sepolia
const contractAddress = "0xXXXXXXXXXXXX..."; // <- pon aquí la dirección real

// 👉 ABI mínimo para interactuar con entregarCertificado
const contractABI = [
  "function entregarCertificado(address to, uint256 id, uint256 cantidad) public"
];

// Conectar con Metamask
connectButton.addEventListener('click', async () => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      contract = new ethers.Contract(contractAddress, contractABI, signer);
      userAddressDisplay.textContent = `Conectado: ${accounts[0]}`;
    } catch (err) {
      console.error(err);
      userAddressDisplay.textContent = '❌ Error al conectar con Metamask';
    }
  } else {
    alert("Instala Metamask para usar esta app.");
  }
});

// Mintear certificado
mintForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const to = document.getElementById('recipient').value;
  const id = parseInt(document.getElementById('tokenId').value);
  const cantidad = parseInt(document.getElementById('amount').value);

  if (!contract) {
    status.textContent = "Conecta Metamask primero.";
    return;
  }

  try {
    const tx = await contract.entregarCertificado(to, id, cantidad);
    status.textContent = "Transacción enviada...";
    await tx.wait();
    status.textContent = `✅ Certificado emitido correctamente (Tx: ${tx.hash})`;
  } catch (err) {
    console.error(err);
    status.textContent = "❌ Error al mintear. Revisa la consola.";
  }
});

