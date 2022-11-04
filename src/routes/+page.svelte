<script lang="ts">
    let a = 0
</script>

<main>
    <head>
        <title>Weight and Balance</title>
    </head>
    <body>
        <div id="header">
            <h1>Welcome to Sam's ERAU Cessna 172 Weight and Balance Calculator!</h1>
            <p>Fill out the info below to calculate weight and balance for your aircraft!</p>    
        </div>
        <div id="calc">
            <table>
                <thead>
                    <th>Item</th>
                    <th>Weight</th>
                    <th>Arm</th>
                    <th>Moment</th>
                </thead>
                <tbody>
                    <tr>
                        <td><input type="text" bind:value={a}></td>
                        <td>{Number(a) + 2}</td>
                        <td>c</td>
                        <td>d</td>
                    </tr>
                </tbody>
            </table>
            
        </div>
    </body>
</main>

<style>
    table, th, td {
        border: 2px solid;
        border-collapse: collapse;
    }
    input {
        background-color: lime;
    }
</style>