const connectButton = document.getElementById('connectButton');
const userAddressDisplay = document.getElementById('userAddress');
const mintForm = document.getElementById('mintForm');
const status = document.getElementById('status');
const balanceDisplay = document.getElementById('balance');

let signer;
let contract;

// Dirección del contrato en Sepolia
const contractAddress = "0x4CC4968105fd5fA485578b247387EE2BfbB4b6a0";

// ABI mínimo para interactuar con entregarCertificado
const contractABI = [
  "function entregarCertificado(address to, uint256 id, uint256 cantidad) public",
  "function balanceOf(address account, uint256 id) public view returns (uint256)"
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

      // Obtener el balance después de conectar
      getTokenBalance();
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
    status.className = "";
    status.textContent = "⏳ Transacción enviada...";
    const tx = await contract.entregarCertificado(to, id, cantidad);
    await tx.wait();
    status.className = "status-success";
    status.textContent = `✅ Certificado emitido correctamente (Tx: ${tx.hash})`;

    // Obtener el balance después de la transacción
    await getTokenBalance();
  } catch (err) {
    console.error(err);
    status.className = "status-error";
    status.textContent = "❌ Error al mintear. Revisa la consola.";
  }
});

// Función para obtener el balance de un token
const getTokenBalance = async () => {
  if (contract) {
    try {
      const address = await signer.getAddress();
      const id = 0; // ID del token a consultar (por ejemplo, ID 0 para "Taller educativo")
      const balance = await contract.balanceOf(address, id);
      balanceDisplay.textContent = `Tienes ${balance.toString()} tokens de tipo ${id}`;
    } catch (error) {
      console.error('Error al obtener el balance:', error);
      balanceDisplay.textContent = 'Error al obtener el balance.';
    }
  } else {
    balanceDisplay.textContent = 'Conecta Metamask primero.';
  }
};
