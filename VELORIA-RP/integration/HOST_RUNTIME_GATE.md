# GTA5HOST runtime gate for full VELORIA integration

The currently verified GTA5HOST runtime starts VELORIA with NodeJS enabled and C# disabled.

This means the RedAge / NeptuneEvo upstream cannot be switched on in the live deploy merely by copying its .NET resources. The integration branch must keep the current Node deploy operational until the hosting runtime is proven to support the required C# resource mode.

## Gate before enabling NeptuneEvo runtime

- Confirm GTA5HOST panel/server plan can enable RAGE:MP C# resources.
- Confirm compatible .NET runtime version for the RedAge source.
- Build NeptuneEvo and NeptuneEvoSDK from source on Linux.
- Start an isolated test server with C# enabled.
- Verify MySQL connectivity against a disposable database.
- Verify client_packages + CEF resource transfer.
- Only then adapt the production deployment.

## If GTA5HOST cannot run the required C# runtime

Do not abandon the four-source architecture. Use RedAge/Moldova/Shadow as gameplay specifications and source donors, then port selected systems behind VELORIA's Node adapters in coherent vertical slices. Diamond remains a useful JS/CEF donor.

The production `main` branch must not be switched to an unverified C# configuration.
