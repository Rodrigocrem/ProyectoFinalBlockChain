require('@nomiclabs/hardhat-ethers');

module.exports = {
  solidity: "0.8.20",  // Especifica la versión del compilador Solidity
  networks: {
    sepolia: {
      url: 'https://rpc.sepolia.org',  // URL de la red Sepolia
      accounts: ['<tu-clave-privada>']  // Usa una clave privada para la cuenta del deployer
    }
  }
};
