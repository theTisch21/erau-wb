export type Aircraft = {
	name: string
	weight: number
	moment: number
	arm: number
}

const list: Aircraft[] = [
    { name: 'E1', weight: 1225, moment: 39258, arm: 32.0473 },
    { name: 'E2', weight: 1200.04, moment: 37501.25, arm: 31.25 },
    { name: 'R- 1', weight: 1325.72, moment: 16460.72, arm: 12.4164 },
    { name: 'R- 2', weight: 1707.7, moment: 70137, arm: 41.071 },
    { name: 'R- 3', weight: 1712.4, moment: 69894, arm: 40.8164 },
    { name: 'R- 4', weight: 1707.7, moment: 70137, arm: 41.071 },
    { name: 'R- 5', weight: 1707.7, moment: 70137, arm: 41.071 },
    { name: 'R- 6', weight: 1714.7, moment: 70880, arm: 41.3367 },
    { name: 'R- 7', weight: 1714.7, moment: 70880, arm: 41.3367 },
    { name: 'R- 8', weight: 1707.7, moment: 70137, arm: 41.071 },
    { name: 'R- 9', weight: 1714.7, moment: 70880, arm: 41.3367 },
    { name: 'R-10', weight: 1707.7, moment: 70137, arm: 41.071 },
    { name: 'R-11', weight: 1714.7, moment: 70880, arm: 41.3367 },
    { name: 'R-12', weight: 1714.7, moment: 70880, arm: 41.3367 },
    { name: 'R-14', weight: 1707.7, moment: 70137, arm: 41.071 },
    { name: 'R-15', weight: 1707.7, moment: 70137, arm: 41.071 },
    { name: 'R-16', weight: 1714.7, moment: 70880, arm: 41.3367 },
    { name: 'R-17', weight: 1713.4, moment: 70525, arm: 41.1608 },
    { name: 'R-19', weight: 1714.8, moment: 71457, arm: 41.6707 },
    { name: 'R-22', weight: 1714.7, moment: 70880, arm: 41.3367 },
    { name: 'R-23', weight: 1689.8, moment: 69508, arm: 41.1339 },
    { name: 'R-25', weight: 1690.1, moment: 70084.9, arm: 41.4679 },
    { name: 'R-29', weight: 1711.4, moment: 70459, arm: 41.1704 },
    { name: 'R-32', weight: 1686.36, moment: 68099.23, arm: 40.3824 },
    { name: 'R-33', weight: 1681.56, moment: 67851.96, arm: 40.3506 },
    { name: 'R-34', weight: 1689.73, moment: 69194.14, arm: 40.9498 },
    { name: 'R-35', weight: 1686.36, moment: 68099.23, arm: 40.3824 },
    { name: 'R-36', weight: 1683.96, moment: 67996.13, arm: 40.3787 },
    { name: 'R-37', weight: 1686.36, moment: 68099.23, arm: 40.3824 },
    { name: 'R-39', weight: 1684.73, moment: 68261.29, arm: 40.5176 },
    { name: 'R-40', weight: 1683.06, moment: 68613.95, arm: 40.7674 },
    { name: 'R-41', weight: 1683.06, moment: 68613.95, arm: 40.7674 },
    { name: 'R-42', weight: 1714.7, moment: 70880, arm: 41.3367 },
    { name: 'R-43', weight: 1683.06, moment: 68613.95, arm: 40.7674 },
    { name: 'R-44', weight: 1675.16, moment: 68156.59, arm: 40.6866 },
    { name: 'R-45', weight: 1678.26, moment: 68407.75, arm: 40.7611 },
    { name: 'R-46', weight: 1682.6, moment: 68576.47, arm: 40.7563 },
    { name: 'R-47', weight: 1680.2, moment: 68473.37, arm: 40.7531 },
    { name: 'R-48', weight: 1682.6, moment: 68576.47, arm: 40.7563 },
    { name: 'R-49 SPIN', weight: 1652.7, moment: 66030.94, arm: 39.9534 },
    { name: 'R-52', weight: 1680.88, moment: 68400.37, arm: 40.6932 },
    { name: 'R-53', weight: 1723.7, moment: 71676, arm: 41.5826 },
    { name: 'R-54', weight: 1714.7, moment: 70880, arm: 41.3367 },
    { name: 'R-55', weight: 1723.7, moment: 71676, arm: 41.5826 },
    { name: 'R-56', weight: 1723.7, moment: 71676, arm: 41.5826 },
    { name: 'R-57', weight: 1723.7, moment: 71676, arm: 41.5826 },
    { name: 'R-58', weight: 1706.4, moment: 70775, arm: 41.4762 },
    { name: 'R-59', weight: 1706.4, moment: 70775, arm: 41.4762 },
    { name: 'R-60', weight: 1706.4, moment: 70775, arm: 41.4762 },
    { name: 'R-61 SPIN', weight: 1679.5875, moment: 68416.12, arm: 40.7339 },
    { name: 'R-62', weight: 1706.4, moment: 70775, arm: 41.4762 },
    { name: 'R-64', weight: 1708.4, moment: 70791, arm: 41.437 },
    { name: 'R-65', weight: 1714.7, moment: 70880, arm: 41.3367 },
    { name: 'R-66', weight: 1714.7, moment: 70880, arm: 41.3367 },
    { name: 'R-67', weight: 1708.4, moment: 70791, arm: 41.437 },
    { name: 'R-68', weight: 1706.4, moment: 70775, arm: 41.4762 },
    { name: 'R-69', weight: 1706.4, moment: 70775, arm: 41.4762 },
    { name: 'R-70', weight: 1720.4, moment: 70649, arm: 41.0654 },
    { name: 'R-71', weight: 1707.7, moment: 70137, arm: 41.071 },
    { name: 'R-72', weight: 1707.7, moment: 70137, arm: 41.071 },
    { name: 'R-73', weight: 1714.8, moment: 71457, arm: 41.6707 },
    { name: 'R-74', weight: 1707.7, moment: 70137, arm: 41.071 },
    { name: 'R-75', weight: 1707.7, moment: 70137, arm: 41.071 },
    { name: 'R-76', weight: 1707.7, moment: 70137, arm: 41.071 },
    { name: 'R-79', weight: 1707.7, moment: 70137, arm: 41.071 },
    { name: 'R-82', weight: 1881.28, moment: 71681.5, arm: 38.1025 },
    { name: 'R-90', weight: 3259.53, moment: 311187.33, arm: 95.47 },
    { name: 'R-91', weight: 3251.818, moment: 310451.06, arm: 95.47 },
    { name: 'R-92', weight: 3248.5, moment: 310134.3, arm: 95.47 },
    { name: 'R-96', weight: 3269.8179, moment: 312061.61, arm: 95.437 },
    { name: 'R-97', weight: 3269.82, moment: 312583.43, arm: 95.5965 },
    { name: 'R-98', weight: 3249.98, moment: 309921.96, arm: 95.3612 },
    { name: 'R-99', weight: 3274.23, moment: 312876.17, arm: 95.5572 }
  ]

export async function lookup(name: string): Promise<Aircraft | null> {
    let out = null
    list.forEach(plane => {
        if(plane.name == name) out = plane
    })
    return out
}