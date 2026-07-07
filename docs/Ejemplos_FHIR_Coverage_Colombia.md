# Ejemplos del recurso FHIR Coverage para Colombia

## Organización (EPS)

### Salud Completa (Régimen Contributivo)

``` json
{
  "resourceType":"Organization",
  "id":"salud-completa",
  "name":"Salud Completa"
}
```

### Salud Cooperativa (Régimen Subsidiado)

``` json
{
  "resourceType":"Organization",
  "id":"salud-cooperativa",
  "name":"Salud Cooperativa"
}
```

------------------------------------------------------------------------

## Caso 1. Cotizante (Titular) - Salud Completa

``` json
{
  "resourceType":"Coverage",
  "status":"active",
  "beneficiary":{"reference":"Patient/juan"},
  "subscriber":{"reference":"Patient/juan"},
  "policyHolder":{"reference":"Patient/juan"},
  "subscriberId":"CC123456789",
  "relationship":{"coding":[{"system":"http://terminology.hl7.org/CodeSystem/subscriber-relationship","code":"self"}]},
  "period":{"start":"2026-01-01"},
  "payor":[{"reference":"Organization/salud-completa"}],
  "class":[{"type":{"text":"Regimen"},"value":"CONTRIBUTIVO"}]
}
```

## Caso 2. Hijo beneficiario

``` json
{
  "resourceType":"Coverage",
  "status":"active",
  "beneficiary":{"reference":"Patient/mateo"},
  "subscriber":{"reference":"Patient/juan"},
  "policyHolder":{"reference":"Patient/juan"},
  "subscriberId":"CC123456789",
  "relationship":{"coding":[{"code":"child"}]},
  "payor":[{"reference":"Organization/salud-completa"}],
  "class":[{"value":"CONTRIBUTIVO"}]
}
```

## Caso 3. Cónyuge beneficiario

``` json
{
  "resourceType":"Coverage",
  "status":"active",
  "beneficiary":{"reference":"Patient/maria"},
  "subscriber":{"reference":"Patient/pedro"},
  "policyHolder":{"reference":"Patient/pedro"},
  "relationship":{"coding":[{"code":"spouse"}]},
  "payor":[{"reference":"Organization/salud-completa"}]
}
```

## Caso 4. Régimen Subsidiado - Salud Cooperativa

``` json
{
  "resourceType":"Coverage",
  "status":"active",
  "beneficiary":{"reference":"Patient/carlos"},
  "subscriber":{"reference":"Patient/carlos"},
  "policyHolder":{"reference":"Organization/estado-colombiano"},
  "relationship":{"coding":[{"code":"self"}]},
  "payor":[{"reference":"Organization/salud-cooperativa"}],
  "class":[{"type":{"text":"Regimen"},"value":"SUBSIDIADO"}]
}
```

## Caso 5. Menor beneficiario del régimen subsidiado

``` json
{
  "resourceType":"Coverage",
  "status":"active",
  "subscriber":{"reference":"Patient/madre"},
  "beneficiary":{"reference":"Patient/hija"},
  "policyHolder":{"reference":"Organization/estado-colombiano"},
  "relationship":{"coding":[{"code":"child"}]},
  "payor":[{"reference":"Organization/salud-cooperativa"}],
  "class":[{"value":"SUBSIDIADO"}]
}
```

## Caso 6. Pensionado

``` json
{
  "resourceType":"Coverage",
  "status":"active",
  "beneficiary":{"reference":"Patient/pensionado"},
  "subscriber":{"reference":"Patient/pensionado"},
  "payor":[{"reference":"Organization/salud-completa"}],
  "class":[
    {"type":{"text":"Regimen"},"value":"CONTRIBUTIVO"},
    {"type":{"text":"Tipo Afiliado"},"value":"PENSIONADO"}
  ]
}
```

## Caso 7. Afiliado adicional

``` json
{
  "resourceType":"Coverage",
  "status":"active",
  "subscriber":{"reference":"Patient/juan"},
  "beneficiary":{"reference":"Patient/ana"},
  "relationship":{"coding":[{"code":"other"}]},
  "payor":[{"reference":"Organization/salud-completa"}],
  "class":[
    {"type":{"text":"Regimen"},"value":"CONTRIBUTIVO"},
    {"type":{"text":"Tipo Afiliado"},"value":"AFILIADO_ADICIONAL"}
  ]
}
```

## Resumen

  Escenario            EPS                 Régimen        Subscriber   Beneficiary
  -------------------- ------------------- -------------- ------------ -------------
  Titular              Salud Completa      Contributivo   Juan         Juan
  Hijo                 Salud Completa      Contributivo   Juan         Mateo
  Cónyuge              Salud Completa      Contributivo   Pedro        María
  Subsidiado           Salud Cooperativa   Subsidiado     Carlos       Carlos
  Hija subsidiada      Salud Cooperativa   Subsidiado     Madre        Hija
  Pensionado           Salud Completa      Contributivo   Pensionado   Pensionado
  Afiliado adicional   Salud Completa      Contributivo   Juan         Ana
