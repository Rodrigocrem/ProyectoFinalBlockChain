const connectButton = document.getElementById('connectButton');
const userAddressDisplay = document.getElementById('userAddress');
const mintForm = document.getElementById('mintForm');
const status = document.getElementById('status');

let signer;
let contract;

// Dirección del contrato en Sepolia
const contractAddress = "0x4CC4968105fd5fA485578b247387EE2BfbB4b6a0";

// ABI mínimo para interactuar con entregarCertificado
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
    status.className = "status-error";
    status.textContent = "Conecta Metamask primero.";
    return;
  }

  try {
    status.className = "";
    status.textContent = "⏳ Transacción enviada...";
    const tx = await contract.entregarCertificado(to, id, cantidad);
    await tx.wait();
    status.className = "status-success";
    status.textContent = `✅ Certificado emitido correctamente (Tx: ${tx.hash})`;
  } catch (err) {
    console.error(err);
    status.className = "status-error";
    status.textContent = "❌ Error al mintear. Revisa la consola.";
  }
});
