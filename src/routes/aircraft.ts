export type Aircraft = {
	name: string
	weight: number
	arm: number
	moment: number
}

const list: Aircraft[] = [
    { name: 'E1', weight: 1225, arm: 39258, moment: 32.0473 },
    { name: 'E2', weight: 1200.04, arm: 37501.25, moment: 31.25 },
    { name: 'R- 1', weight: 1325.72, arm: 16460.72, moment: 12.4164 },
    { name: 'R- 2', weight: 1707.7, arm: 70137, moment: 41.071 },
    { name: 'R- 3', weight: 1712.4, arm: 69894, moment: 40.8164 },
    { name: 'R- 4', weight: 1707.7, arm: 70137, moment: 41.071 },
    { name: 'R- 5', weight: 1707.7, arm: 70137, moment: 41.071 },
    { name: 'R- 6', weight: 1714.7, arm: 70880, moment: 41.3367 },
    { name: 'R- 7', weight: 1714.7, arm: 70880, moment: 41.3367 },
    { name: 'R- 8', weight: 1707.7, arm: 70137, moment: 41.071 },
    { name: 'R- 9', weight: 1714.7, arm: 70880, moment: 41.3367 },
    { name: 'R-10', weight: 1707.7, arm: 70137, moment: 41.071 },
    { name: 'R-11', weight: 1714.7, arm: 70880, moment: 41.3367 },
    { name: 'R-12', weight: 1714.7, arm: 70880, moment: 41.3367 },
    { name: 'R-14', weight: 1707.7, arm: 70137, moment: 41.071 },
    { name: 'R-15', weight: 1707.7, arm: 70137, moment: 41.071 },
    { name: 'R-16', weight: 1714.7, arm: 70880, moment: 41.3367 },
    { name: 'R-17', weight: 1713.4, arm: 70525, moment: 41.1608 },
    { name: 'R-19', weight: 1714.8, arm: 71457, moment: 41.6707 },
    { name: 'R-22', weight: 1714.7, arm: 70880, moment: 41.3367 },
    { name: 'R-23', weight: 1689.8, arm: 69508, moment: 41.1339 },
    { name: 'R-25', weight: 1690.1, arm: 70084.9, moment: 41.4679 },
    { name: 'R-29', weight: 1711.4, arm: 70459, moment: 41.1704 },
    { name: 'R-32', weight: 1686.36, arm: 68099.23, moment: 40.3824 },
    { name: 'R-33', weight: 1681.56, arm: 67851.96, moment: 40.3506 },
    { name: 'R-34', weight: 1689.73, arm: 69194.14, moment: 40.9498 },
    { name: 'R-35', weight: 1686.36, arm: 68099.23, moment: 40.3824 },
    { name: 'R-36', weight: 1683.96, arm: 67996.13, moment: 40.3787 },
    { name: 'R-37', weight: 1686.36, arm: 68099.23, moment: 40.3824 },
    { name: 'R-39', weight: 1684.73, arm: 68261.29, moment: 40.5176 },
    { name: 'R-40', weight: 1683.06, arm: 68613.95, moment: 40.7674 },
    { name: 'R-41', weight: 1683.06, arm: 68613.95, moment: 40.7674 },
    { name: 'R-42', weight: 1714.7, arm: 70880, moment: 41.3367 },
    { name: 'R-43', weight: 1683.06, arm: 68613.95, moment: 40.7674 },
    { name: 'R-44', weight: 1675.16, arm: 68156.59, moment: 40.6866 },
    { name: 'R-45', weight: 1678.26, arm: 68407.75, moment: 40.7611 },
    { name: 'R-46', weight: 1682.6, arm: 68576.47, moment: 40.7563 },
    { name: 'R-47', weight: 1680.2, arm: 68473.37, moment: 40.7531 },
    { name: 'R-48', weight: 1682.6, arm: 68576.47, moment: 40.7563 },
    { name: 'R-49 SPIN', weight: 1652.7, arm: 66030.94, moment: 39.9534 },
    { name: 'R-52', weight: 1680.88, arm: 68400.37, moment: 40.6932 },
    { name: 'R-53', weight: 1723.7, arm: 71676, moment: 41.5826 },
    { name: 'R-54', weight: 1714.7, arm: 70880, moment: 41.3367 },
    { name: 'R-55', weight: 1723.7, arm: 71676, moment: 41.5826 },
    { name: 'R-56', weight: 1723.7, arm: 71676, moment: 41.5826 },
    { name: 'R-57', weight: 1723.7, arm: 71676, moment: 41.5826 },
    { name: 'R-58', weight: 1706.4, arm: 70775, moment: 41.4762 },
    { name: 'R-59', weight: 1706.4, arm: 70775, moment: 41.4762 },
    { name: 'R-60', weight: 1706.4, arm: 70775, moment: 41.4762 },
    { name: 'R-61 SPIN', weight: 1679.5875, arm: 68416.12, moment: 40.7339 },
    { name: 'R-62', weight: 1706.4, arm: 70775, moment: 41.4762 },
    { name: 'R-64', weight: 1708.4, arm: 70791, moment: 41.437 },
    { name: 'R-65', weight: 1714.7, arm: 70880, moment: 41.3367 },
    { name: 'R-66', weight: 1714.7, arm: 70880, moment: 41.3367 },
    { name: 'R-67', weight: 1708.4, arm: 70791, moment: 41.437 },
    { name: 'R-68', weight: 1706.4, arm: 70775, moment: 41.4762 },
    { name: 'R-69', weight: 1706.4, arm: 70775, moment: 41.4762 },
    { name: 'R-70', weight: 1720.4, arm: 70649, moment: 41.0654 },
    { name: 'R-71', weight: 1707.7, arm: 70137, moment: 41.071 },
    { name: 'R-72', weight: 1707.7, arm: 70137, moment: 41.071 },
    { name: 'R-73', weight: 1714.8, arm: 71457, moment: 41.6707 },
    { name: 'R-74', weight: 1707.7, arm: 70137, moment: 41.071 },
    { name: 'R-75', weight: 1707.7, arm: 70137, moment: 41.071 },
    { name: 'R-76', weight: 1707.7, arm: 70137, moment: 41.071 },
    { name: 'R-79', weight: 1707.7, arm: 70137, moment: 41.071 },
    { name: 'R-82', weight: 1881.28, arm: 71681.5, moment: 38.1025 },
    { name: 'R-90', weight: 3259.53, arm: 311187.33, moment: 95.47 },
    { name: 'R-91', weight: 3251.818, arm: 310451.06, moment: 95.47 },
    { name: 'R-92', weight: 3248.5, arm: 310134.3, moment: 95.47 },
    { name: 'R-96', weight: 3269.8179, arm: 312061.61, moment: 95.437 },
    { name: 'R-97', weight: 3269.82, arm: 312583.43, moment: 95.5965 },
    { name: 'R-98', weight: 3249.98, arm: 309921.96, moment: 95.3612 },
    { name: 'R-99', weight: 3274.23, arm: 312876.17, moment: 95.5572 }
  ]

export async function lookup(name: string): Promise<Aircraft | null> {
    for (const plane in list) {
        if (Object.prototype.hasOwnProperty.call(list, plane)) {
            const element = list[plane];
            if(element.name == name)
            return element
        }
    }
    return null
}