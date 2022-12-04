import { GithubUser } from "./GitHubUser.js"
export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.tbody = this.root.querySelector('table tbody')
        
        this.load()
    }

    async add(username) {
        try {
            const userAlreadyOnList = this.users.find(eachUser => eachUser.login === username)

            const user = await GithubUser.search(username)
            
            if (user.login === undefined) {
                throw new Error('Usuário não encontrado.')
            } else if (userAlreadyOnList) {
                throw new Error('Usuário já esta na lista.')
            } else {
                this.users = [user, ...this.users]
                this.update()
                this.save()
            }

        } catch(error) { 
            alert(error.message)
        }
        
    }

    load() {
        this.users = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.users))
    }
}

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.update()
        this.onAdd()
    }

    onAdd() {
        const addButton = this.root.querySelector('.search button')
        const usernameInput = document.querySelector('.search input')
        addButton.onclick = () => {

            this.add(usernameInput.value)

            usernameInput.value = ""
        }
        usernameInput.onkeypress = (event) => {
            if (event.key === 'Enter') {
                addButton.click()
            }
        }
    }

    update() {
        this.removeAllTableRows()

        this.users.forEach(user => {
            const createdRow = this.createTableRow()

            createdRow.querySelector('.user img').src = `https://github.com/${user.login}.png`
            createdRow.querySelector('.user img').alt = `Foto do ${user.name}`
            createdRow.querySelector('.user a').href = `https://github.com/${user.login}`
            createdRow.querySelector('.user p').textContent = `${user.name}`
            createdRow.querySelector('.user span').textContent = `${user.login}`
            createdRow.querySelector('.repositories').textContent = `${user.public_repos}`
            createdRow.querySelector('.followers').textContent = `${user.followers}`

            createdRow.querySelector('.remove').onclick = () => {
                const reallyWantToRemoveThisUserFromFavorites = confirm('Deseja remover este usuário dos favoritos?')
                
                if (reallyWantToRemoveThisUserFromFavorites == true) {
                    this.removeRow(user)
                }
            }

            this.tbody.append(createdRow)
        })
    }

    removeAllTableRows() {
        this.tbody.querySelectorAll('tr').forEach(tableRow => {
            tableRow.remove()
        })
    }

    createTableRow() {
        const tableRow = document.createElement('tr')
        tableRow.innerHTML = `
            <tr>
                <td class="user">
                    <img src="https://github.com/nicolasjandre.png" alt="Imagem do Usuário">
                    <a href="https://github.com/nicolasjandre" target="_blank">
                        <p>Nicolas Jandre</p>
                        <span>nicolasjandre</span>
                    </a>
                </td>
                <td class="repositories">11</td>
                <td class="followers">0</td>
                <td class="remove"><button>&times;</button></td>
            </tr>
        `

        return tableRow
    }

    removeRow(user) {
        const filteredUsers = this.users.filter(eachUser => user.login !== eachUser.login)
        this.users = filteredUsers
        this.update()
        this.save()
    }
}