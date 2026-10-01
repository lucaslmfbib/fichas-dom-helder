/**
 * Geração Avançada de Cutter-Sanborn
 * Lógica baseada na tabela Cutter-Sanborn de 3 algarismos.
 */

const cutterMap = [
    { prefix: "A", num: 111 }, { prefix: "Ab", num: 112 }, { prefix: "Aba", num: 113 }, { prefix: "Abb", num: 114 },
    { prefix: "Abc", num: 115 }, { prefix: "Abd", num: 116 }, { prefix: "Abe", num: 117 }, { prefix: "Abi", num: 118 },
    { prefix: "Abo", num: 119 }, { prefix: "Abr", num: 121 }, { prefix: "Abreu", num: 122 }, { prefix: "Ac", num: 123 },
    { prefix: "Ad", num: 124 }, { prefix: "Ada", num: 125 }, { prefix: "Ado", num: 126 }, { prefix: "Ae", num: 127 },
    { prefix: "Af", num: 128 }, { prefix: "Ag", num: 129 }, { prefix: "Aguiar", num: 131 }, { prefix: "Ai", num: 132 },
    { prefix: "Al", num: 133 }, { prefix: "Alb", num: 134 }, { prefix: "Alc", num: 135 }, { prefix: "Ald", num: 136 },
    { prefix: "Ale", num: 137 }, { prefix: "Alex", num: 138 }, { prefix: "Alf", num: 139 }, { prefix: "Ali", num: 141 },
    { prefix: "All", num: 142 }, { prefix: "Alm", num: 143 }, { prefix: "Almeida", num: 144 }, { prefix: "Alp", num: 145 },
    { prefix: "Als", num: 146 }, { prefix: "Alt", num: 147 }, { prefix: "Alv", num: 148 }, { prefix: "Alves", num: 149 },
    { prefix: "Am", num: 151 }, { prefix: "Ama", num: 152 }, { prefix: "Amaral", num: 153 }, { prefix: "Amb", num: 154 },
    { prefix: "Amc", num: 155 }, { prefix: "Ame", num: 156 }, { prefix: "Ami", num: 157 }, { prefix: "Amo", num: 158 },
    { prefix: "Amorim", num: 159 }, { prefix: "An", num: 161 }, { prefix: "And", num: 162 }, { prefix: "Andrade", num: 163 },
    { prefix: "Andre", num: 164 }, { prefix: "Ang", num: 165 }, { prefix: "Ani", num: 166 }, { prefix: "Ano", num: 167 },
    { prefix: "Ant", num: 168 }, { prefix: "Antunes", num: 169 }, { prefix: "Ap", num: 171 }, { prefix: "Ar", num: 172 },
    { prefix: "Araujo", num: 173 }, { prefix: "Arc", num: 174 }, { prefix: "Are", num: 175 }, { prefix: "Ari", num: 176 },
    { prefix: "Arm", num: 177 }, { prefix: "Arn", num: 178 }, { prefix: "Aro", num: 179 }, { prefix: "Arr", num: 181 },
    { prefix: "Art", num: 182 }, { prefix: "As", num: 183 }, { prefix: "Ass", num: 184 }, { prefix: "Assis", num: 185 },
    { prefix: "Ast", num: 186 }, { prefix: "At", num: 187 }, { prefix: "Au", num: 188 }, { prefix: "Aug", num: 189 },
    { prefix: "Av", num: 191 }, { prefix: "Ave", num: 192 }, { prefix: "Avi", num: 193 }, { prefix: "Ay", num: 194 },
    { prefix: "Az", num: 195 }, { prefix: "Azevedo", num: 196 },
    { prefix: "B", num: 111 }, { prefix: "Ba", num: 112 }, { prefix: "Bac", num: 113 }, { prefix: "Bad", num: 114 },
    { prefix: "Bae", num: 115 }, { prefix: "Baf", num: 116 }, { prefix: "Bag", num: 117 }, { prefix: "Bah", num: 118 },
    { prefix: "Bai", num: 119 }, { prefix: "Bal", num: 121 }, { prefix: "Bam", num: 122 }, { prefix: "Ban", num: 123 },
    { prefix: "Bap", num: 124 }, { prefix: "Baptista", num: 125 }, { prefix: "Bar", num: 126 }, { prefix: "Barb", num: 127 },
    { prefix: "Barbosa", num: 128 }, { prefix: "Barc", num: 129 }, { prefix: "Bard", num: 131 }, { prefix: "Bare", num: 132 },
    { prefix: "Bari", num: 133 }, { prefix: "Barl", num: 134 }, { prefix: "Barn", num: 135 }, { prefix: "Baro", num: 136 },
    { prefix: "Barr", num: 137 }, { prefix: "Barreto", num: 138 }, { prefix: "Barros", num: 139 }, { prefix: "Bars", num: 141 },
    { prefix: "Bart", num: 142 }, { prefix: "Bas", num: 143 }, { prefix: "Bastos", num: 144 }, { prefix: "Bat", num: 145 },
    { prefix: "Batista", num: 146 }, { prefix: "Bau", num: 147 }, { prefix: "Bav", num: 148 }, { prefix: "Bax", num: 149 },
    { prefix: "Bay", num: 151 }, { prefix: "Baz", num: 152 }, { prefix: "Be", num: 153 }, { prefix: "Bec", num: 154 },
    { prefix: "Bed", num: 155 }, { prefix: "Bee", num: 156 }, { prefix: "Bef", num: 157 }, { prefix: "Beg", num: 158 },
    { prefix: "Beh", num: 159 }, { prefix: "Bei", num: 161 }, { prefix: "Bel", num: 162 }, { prefix: "Bem", num: 163 },
    { prefix: "Ben", num: 164 }, { prefix: "Beo", num: 165 }, { prefix: "Ber", num: 166 }, { prefix: "Bern", num: 167 },
    { prefix: "Bernardo", num: 168 }, { prefix: "Bero", num: 169 }, { prefix: "Bes", num: 171 }, { prefix: "Bet", num: 172 },
    { prefix: "Bev", num: 173 }, { prefix: "Bex", num: 174 }, { prefix: "Bey", num: 175 }, { prefix: "Bez", num: 176 },
    { prefix: "Bi", num: 177 }, { prefix: "Bic", num: 178 }, { prefix: "Bid", num: 179 }, { prefix: "Bie", num: 181 },
    { prefix: "Bif", num: 182 }, { prefix: "Big", num: 183 }, { prefix: "Bih", num: 184 }, { prefix: "Bii", num: 185 },
    { prefix: "Bil", num: 186 }, { prefix: "Bim", num: 187 }, { prefix: "Bin", num: 188 }, { prefix: "Bio", num: 189 },
    { prefix: "Bir", num: 191 }, { prefix: "Bis", num: 192 }, { prefix: "Bit", num: 193 }, { prefix: "Biv", num: 194 },
    { prefix: "Bix", num: 195 }, { prefix: "Biy", num: 196 }, { prefix: "Biz", num: 197 }, { prefix: "Bl", num: 198 },
    { prefix: "Bo", num: 211 }, { prefix: "Boc", num: 212 }, { prefix: "Bod", num: 213 }, { prefix: "Boe", num: 214 },
    { prefix: "Bof", num: 215 }, { prefix: "Bog", num: 216 }, { prefix: "Boh", num: 217 }, { prefix: "Boi", num: 218 },
    { prefix: "Bol", num: 219 }, { prefix: "Bom", num: 221 }, { prefix: "Bon", num: 222 }, { prefix: "Borges", num: 223 },
    { prefix: "C", num: 111 }, { prefix: "Ca", num: 112 }, { prefix: "Cab", num: 113 }, { prefix: "Cabral", num: 114 },
    { prefix: "Cac", num: 115 }, { prefix: "Cad", num: 116 }, { prefix: "Cae", num: 117 }, { prefix: "Caf", num: 118 },
    { prefix: "Cag", num: 119 }, { prefix: "Cah", num: 121 }, { prefix: "Cai", num: 122 }, { prefix: "Cal", num: 123 },
    { prefix: "Cam", num: 124 }, { prefix: "Camargo", num: 125 }, { prefix: "Camp", num: 126 }, { prefix: "Campos", num: 127 },
    { prefix: "Can", num: 128 }, { prefix: "Cap", num: 129 }, { prefix: "Car", num: 131 }, { prefix: "Card", num: 132 },
    { prefix: "Cardoso", num: 133 }, { prefix: "Care", num: 134 }, { prefix: "Cari", num: 135 }, { prefix: "Carl", num: 136 },
    { prefix: "Carmo", num: 137 }, { prefix: "Carn", num: 138 }, { prefix: "Carneiro", num: 139 }, { prefix: "Caro", num: 141 },
    { prefix: "Carp", num: 142 }, { prefix: "Carr", num: 143 }, { prefix: "Carv", num: 144 }, { prefix: "Carvalho", num: 145 },
    { prefix: "Cas", num: 146 }, { prefix: "Cast", num: 147 }, { prefix: "Castro", num: 148 }, { prefix: "Cat", num: 149 },
    { prefix: "Cav", num: 151 }, { prefix: "Cavalcante", num: 152 }, { prefix: "Cax", num: 153 }, { prefix: "Cay", num: 154 },
    { prefix: "Caz", num: 155 }, { prefix: "Ce", num: 156 }, { prefix: "Cec", num: 157 }, { prefix: "Ced", num: 158 },
    { prefix: "Cee", num: 159 }, { prefix: "Cef", num: 161 }, { prefix: "Ceg", num: 162 }, { prefix: "Ceh", num: 163 },
    { prefix: "Cei", num: 164 }, { prefix: "Cel", num: 165 }, { prefix: "Cem", num: 166 }, { prefix: "Cen", num: 167 },
    { prefix: "Ceo", num: 168 }, { prefix: "Cer", num: 169 }, { prefix: "Ces", num: 171 }, { prefix: "Cet", num: 172 },
    { prefix: "Cev", num: 173 }, { prefix: "Cex", num: 174 }, { prefix: "Cey", num: 175 }, { prefix: "Cez", num: 176 },
    { prefix: "Ch", num: 177 }, { prefix: "Chagas", num: 178 }, { prefix: "Co", num: 211 }, { prefix: "Coc", num: 212 },
    { prefix: "Cod", num: 213 }, { prefix: "Coe", num: 214 }, { prefix: "Coelho", num: 215 }, { prefix: "Cof", num: 216 },
    { prefix: "Cog", num: 217 }, { prefix: "Coh", num: 218 }, { prefix: "Coi", num: 219 }, { prefix: "Col", num: 221 },
    { prefix: "Com", num: 222 }, { prefix: "Con", num: 223 }, { prefix: "Conceicao", num: 224 }, { prefix: "Cor", num: 225 },
    { prefix: "Cordeiro", num: 226 }, { prefix: "Correa", num: 227 }, { prefix: "Cos", num: 228 }, { prefix: "Costa", num: 229 },
    { prefix: "Cruz", num: 231 },
    { prefix: "D", num: 111 }, { prefix: "Da", num: 112 }, { prefix: "Dab", num: 113 }, { prefix: "Dac", num: 114 },
    { prefix: "Dad", num: 115 }, { prefix: "Dae", num: 116 }, { prefix: "Daf", num: 117 }, { prefix: "Dag", num: 118 },
    { prefix: "Dah", num: 119 }, { prefix: "Dai", num: 121 }, { prefix: "Dal", num: 122 }, { prefix: "Dam", num: 123 },
    { prefix: "Dan", num: 124 }, { prefix: "Dantas", num: 125 }, { prefix: "Dap", num: 126 }, { prefix: "Dar", num: 127 },
    { prefix: "Das", num: 128 }, { prefix: "Dat", num: 129 }, { prefix: "Dav", num: 131 }, { prefix: "Dax", num: 132 },
    { prefix: "Day", num: 133 }, { prefix: "Daz", num: 134 }, { prefix: "De", num: 135 }, { prefix: "Dec", num: 136 },
    { prefix: "Ded", num: 137 }, { prefix: "Dee", num: 138 }, { prefix: "Def", num: 139 }, { prefix: "Deg", num: 141 },
    { prefix: "Deh", num: 142 }, { prefix: "Dei", num: 143 }, { prefix: "Del", num: 144 }, { prefix: "Dem", num: 145 },
    { prefix: "Den", num: 146 }, { prefix: "Deo", num: 147 }, { prefix: "Der", num: 148 }, { prefix: "Des", num: 149 },
    { prefix: "Det", num: 151 }, { prefix: "Dev", num: 152 }, { prefix: "Dex", num: 153 }, { prefix: "Dey", num: 154 },
    { prefix: "Dez", num: 155 }, { prefix: "Di", num: 156 }, { prefix: "Dias", num: 157 }, { prefix: "Dic", num: 158 },
    { prefix: "Did", num: 159 }, { prefix: "Die", num: 161 }, { prefix: "Dif", num: 162 }, { prefix: "Dig", num: 163 },
    { prefix: "Dih", num: 164 }, { prefix: "Dii", num: 165 }, { prefix: "Dil", num: 166 }, { prefix: "Dim", num: 167 },
    { prefix: "Din", num: 168 }, { prefix: "Diniz", num: 169 }, { prefix: "Dio", num: 171 }, { prefix: "Dir", num: 172 },
    { prefix: "Dis", num: 173 }, { prefix: "Dit", num: 174 }, { prefix: "Div", num: 175 }, { prefix: "Dix", num: 176 },
    { prefix: "Diy", num: 177 }, { prefix: "Diz", num: 178 }, { prefix: "Do", num: 179 }, { prefix: "Doc", num: 181 },
    { prefix: "Dod", num: 182 }, { prefix: "Doe", num: 183 }, { prefix: "Dof", num: 184 }, { prefix: "Dog", num: 185 },
    { prefix: "Doh", num: 186 }, { prefix: "Doi", num: 187 }, { prefix: "Dol", num: 188 }, { prefix: "Dom", num: 189 },
    { prefix: "Domingos", num: 191 }, { prefix: "Don", num: 192 }, { prefix: "Doo", num: 193 }, { prefix: "Dor", num: 194 },
    { prefix: "Dos", num: 195 }, { prefix: "Dot", num: 196 }, { prefix: "Dov", num: 197 }, { prefix: "Dox", num: 198 },
    { prefix: "Doy", num: 199 }, { prefix: "Doz", num: 211 }, { prefix: "Dr", num: 212 }, { prefix: "Duarte", num: 213 },
    { prefix: "F", num: 111 }, { prefix: "Fa", num: 112 }, { prefix: "Fab", num: 113 }, { prefix: "Fac", num: 114 },
    { prefix: "Fad", num: 115 }, { prefix: "Fae", num: 116 }, { prefix: "Faf", num: 117 }, { prefix: "Fag", num: 118 },
    { prefix: "Fagundes", num: 119 }, { prefix: "Fah", num: 121 }, { prefix: "Fai", num: 122 }, { prefix: "Fal", num: 123 },
    { prefix: "Fam", num: 124 }, { prefix: "Fan", num: 125 }, { prefix: "Fap", num: 126 }, { prefix: "Far", num: 127 },
    { prefix: "Farias", num: 128 }, { prefix: "Fas", num: 129 }, { prefix: "Fat", num: 131 }, { prefix: "Fav", num: 132 },
    { prefix: "Fax", num: 133 }, { prefix: "Fay", num: 134 }, { prefix: "Faz", num: 135 }, { prefix: "Fe", num: 136 },
    { prefix: "Fec", num: 137 }, { prefix: "Fed", num: 138 }, { prefix: "Fee", num: 139 }, { prefix: "Fef", num: 141 },
    { prefix: "Feg", num: 142 }, { prefix: "Feh", num: 143 }, { prefix: "Fei", num: 144 }, { prefix: "Fel", num: 145 },
    { prefix: "Fem", num: 146 }, { prefix: "Fen", num: 147 }, { prefix: "Feo", num: 148 }, { prefix: "Fer", num: 149 },
    { prefix: "Fernandes", num: 151 }, { prefix: "Ferreira", num: 152 }, { prefix: "Fes", num: 153 }, { prefix: "Fet", num: 154 },
    { prefix: "Fev", num: 155 }, { prefix: "Fex", num: 156 }, { prefix: "Fey", num: 157 }, { prefix: "Fez", num: 158 },
    { prefix: "Fi", num: 159 }, { prefix: "Fic", num: 161 }, { prefix: "Fid", num: 162 }, { prefix: "Fie", num: 163 },
    { prefix: "Fif", num: 164 }, { prefix: "Fig", num: 165 }, { prefix: "Figueiredo", num: 166 }, { prefix: "Fih", num: 167 },
    { prefix: "Fii", num: 168 }, { prefix: "Fil", num: 169 }, { prefix: "Fim", num: 171 }, { prefix: "Fin", num: 172 },
    { prefix: "Fio", num: 173 }, { prefix: "Fir", num: 174 }, { prefix: "Fis", num: 175 }, { prefix: "Fit", num: 176 },
    { prefix: "Fiv", num: 177 }, { prefix: "Fix", num: 178 }, { prefix: "Fiy", num: 179 }, { prefix: "Fiz", num: 181 },
    { prefix: "Fl", num: 182 }, { prefix: "Fo", num: 183 }, { prefix: "Foc", num: 184 }, { prefix: "Fod", num: 185 },
    { prefix: "Foe", num: 186 }, { prefix: "Fof", num: 187 }, { prefix: "Fog", num: 188 }, { prefix: "Foh", num: 189 },
    { prefix: "Foi", num: 191 }, { prefix: "Fol", num: 192 }, { prefix: "Fom", num: 193 }, { prefix: "Fon", num: 194 },
    { prefix: "Fonseca", num: 195 }, { prefix: "Fontes", num: 196 }, { prefix: "For", num: 197 }, { prefix: "Fos", num: 198 },
    { prefix: "Fot", num: 199 }, { prefix: "Fov", num: 211 }, { prefix: "Fox", num: 212 }, { prefix: "Foy", num: 213 },
    { prefix: "Foz", num: 214 }, { prefix: "Fr", num: 215 }, { prefix: "Franco", num: 216 }, { prefix: "Freitas", num: 217 },
    { prefix: "G", num: 111 }, { prefix: "Ga", num: 112 }, { prefix: "Gab", num: 113 }, { prefix: "Gac", num: 114 },
    { prefix: "Gad", num: 115 }, { prefix: "Gae", num: 116 }, { prefix: "Gaf", num: 117 }, { prefix: "Gag", num: 118 },
    { prefix: "Gah", num: 119 }, { prefix: "Gai", num: 121 }, { prefix: "Gal", num: 122 }, { prefix: "Galvao", num: 123 },
    { prefix: "Gam", num: 124 }, { prefix: "Gan", num: 125 }, { prefix: "Gap", num: 126 }, { prefix: "Gar", num: 127 },
    { prefix: "Garcia", num: 128 }, { prefix: "Gas", num: 129 }, { prefix: "Gat", num: 131 }, { prefix: "Gav", num: 132 },
    { prefix: "Gax", num: 133 }, { prefix: "Gay", num: 134 }, { prefix: "Gaz", num: 135 }, { prefix: "Ge", num: 136 },
    { prefix: "Gec", num: 137 }, { prefix: "Ged", num: 138 }, { prefix: "Gee", num: 139 }, { prefix: "Gef", num: 141 },
    { prefix: "Geg", num: 142 }, { prefix: "Geh", num: 143 }, { prefix: "Gei", num: 144 }, { prefix: "Gel", num: 145 },
    { prefix: "Gem", num: 146 }, { prefix: "Gen", num: 147 }, { prefix: "Geo", num: 148 }, { prefix: "Ger", num: 149 },
    { prefix: "Ges", num: 151 }, { prefix: "Get", num: 152 }, { prefix: "Gev", num: 153 }, { prefix: "Gex", num: 154 },
    { prefix: "Gey", num: 155 }, { prefix: "Gez", num: 156 }, { prefix: "Gi", num: 157 }, { prefix: "Gic", num: 158 },
    { prefix: "Gid", num: 159 }, { prefix: "Gie", num: 161 }, { prefix: "Gif", num: 162 }, { prefix: "Gig", num: 163 },
    { prefix: "Gih", num: 164 }, { prefix: "Gii", num: 165 }, { prefix: "Gil", num: 166 }, { prefix: "Gim", num: 167 },
    { prefix: "Gin", num: 168 }, { prefix: "Gio", num: 169 }, { prefix: "Gir", num: 171 }, { prefix: "Gis", num: 172 },
    { prefix: "Git", num: 173 }, { prefix: "Giv", num: 174 }, { prefix: "Gix", num: 175 }, { prefix: "Giy", num: 176 },
    { prefix: "Giz", num: 177 }, { prefix: "Gl", num: 178 }, { prefix: "Go", num: 179 }, { prefix: "Goc", num: 181 },
    { prefix: "God", num: 182 }, { prefix: "Godoi", num: 183 }, { prefix: "Godoy", num: 184 }, { prefix: "Goe", num: 185 },
    { prefix: "Gof", num: 186 }, { prefix: "Gog", num: 187 }, { prefix: "Goh", num: 188 }, { prefix: "Goi", num: 189 },
    { prefix: "Gol", num: 191 }, { prefix: "Gom", num: 192 }, { prefix: "Gomes", num: 193 }, { prefix: "Gon", num: 194 },
    { prefix: "Goncalves", num: 195 }, { prefix: "Goo", num: 196 }, { prefix: "Gor", num: 197 }, { prefix: "Gos", num: 198 },
    { prefix: "Got", num: 199 }, { prefix: "Gov", num: 211 }, { prefix: "Gox", num: 212 }, { prefix: "Goy", num: 213 },
    { prefix: "Goz", num: 214 }, { prefix: "Gr", num: 215 }, { prefix: "Gu", num: 216 }, { prefix: "Guedes", num: 217 },
    { prefix: "Guimaraes", num: 218 },
    { prefix: "L", num: 111 }, { prefix: "La", num: 112 }, { prefix: "Lab", num: 113 }, { prefix: "Lac", num: 114 },
    { prefix: "Lacerda", num: 115 }, { prefix: "Lad", num: 116 }, { prefix: "Lae", num: 117 }, { prefix: "Laf", num: 118 },
    { prefix: "Lag", num: 119 }, { prefix: "Lah", num: 121 }, { prefix: "Lai", num: 122 }, { prefix: "Lal", num: 123 },
    { prefix: "Lam", num: 124 }, { prefix: "Lan", num: 125 }, { prefix: "Lap", num: 126 }, { prefix: "Lar", num: 127 },
    { prefix: "Las", num: 128 }, { prefix: "Lat", num: 129 }, { prefix: "Lav", num: 131 }, { prefix: "Lax", num: 132 },
    { prefix: "Lay", num: 133 }, { prefix: "Laz", num: 134 }, { prefix: "Le", num: 135 }, { prefix: "Leal", num: 136 },
    { prefix: "Lec", num: 137 }, { prefix: "Led", num: 138 }, { prefix: "Lee", num: 139 }, { prefix: "Lef", num: 141 },
    { prefix: "Leg", num: 142 }, { prefix: "Leh", num: 143 }, { prefix: "Lei", num: 144 }, { prefix: "Leite", num: 145 },
    { prefix: "Lel", num: 146 }, { prefix: "Lem", num: 147 }, { prefix: "Lemos", num: 148 }, { prefix: "Len", num: 149 },
    { prefix: "Leo", num: 151 }, { prefix: "Ler", num: 152 }, { prefix: "Les", num: 153 }, { prefix: "Let", num: 154 },
    { prefix: "Lev", num: 155 }, { prefix: "Lex", num: 156 }, { prefix: "Ley", num: 157 }, { prefix: "Lez", num: 158 },
    { prefix: "Li", num: 159 }, { prefix: "Lic", num: 161 }, { prefix: "Lid", num: 162 }, { prefix: "Lie", num: 163 },
    { prefix: "Lif", num: 164 }, { prefix: "Lig", num: 165 }, { prefix: "Lih", num: 166 }, { prefix: "Lii", num: 167 },
    { prefix: "Lil", num: 168 }, { prefix: "Lim", num: 169 }, { prefix: "Lima", num: 171 }, { prefix: "Lin", num: 172 },
    { prefix: "Lio", num: 173 }, { prefix: "Lir", num: 174 }, { prefix: "Lis", num: 175 }, { prefix: "Lit", num: 176 },
    { prefix: "Liv", num: 177 }, { prefix: "Lix", num: 178 }, { prefix: "Liy", num: 179 }, { prefix: "Liz", num: 181 },
    { prefix: "Ll", num: 182 }, { prefix: "Lo", num: 183 }, { prefix: "Loc", num: 184 }, { prefix: "Lod", num: 185 },
    { prefix: "Loe", num: 186 }, { prefix: "Lof", num: 187 }, { prefix: "Log", num: 188 }, { prefix: "Loh", num: 189 },
    { prefix: "Loi", num: 191 }, { prefix: "Lol", num: 192 }, { prefix: "Lom", num: 193 }, { prefix: "Lon", num: 194 },
    { prefix: "Loo", num: 195 }, { prefix: "Lopes", num: 196 }, { prefix: "Lor", num: 197 }, { prefix: "Los", num: 198 },
    { prefix: "Lot", num: 199 }, { prefix: "Lou", num: 211 }, { prefix: "Lov", num: 212 }, { prefix: "Lox", num: 213 },
    { prefix: "Loy", num: 214 }, { prefix: "Loz", num: 215 }, { prefix: "Lu", num: 216 }, { prefix: "Luc", num: 217 },
    { prefix: "Luz", num: 218 },
    { prefix: "M", num: 111 }, { prefix: "Ma", num: 112 }, { prefix: "Mab", num: 113 }, { prefix: "Mac", num: 114 },
    { prefix: "Macedo", num: 115 }, { prefix: "Machado", num: 116 }, { prefix: "Mad", num: 117 }, { prefix: "Mae", num: 118 },
    { prefix: "Maf", num: 119 }, { prefix: "Mag", num: 121 }, { prefix: "Magalhaes", num: 122 }, { prefix: "Mah", num: 123 },
    { prefix: "Mai", num: 124 }, { prefix: "Mal", num: 125 }, { prefix: "Mam", num: 126 }, { prefix: "Man", num: 127 },
    { prefix: "Map", num: 128 }, { prefix: "Mar", num: 129 }, { prefix: "Marques", num: 131 }, { prefix: "Martins", num: 132 },
    { prefix: "Mas", num: 133 }, { prefix: "Mat", num: 134 }, { prefix: "Matos", num: 135 }, { prefix: "Mav", num: 136 },
    { prefix: "Max", num: 137 }, { prefix: "May", num: 138 }, { prefix: "Maz", num: 139 }, { prefix: "Me", num: 141 },
    { prefix: "Mec", num: 142 }, { prefix: "Med", num: 143 }, { prefix: "Medeiros", num: 144 }, { prefix: "Mee", num: 145 },
    { prefix: "Mef", num: 146 }, { prefix: "Meg", num: 147 }, { prefix: "Meh", num: 148 }, { prefix: "Mei", num: 149 },
    { prefix: "Meireles", num: 151 }, { prefix: "Mel", num: 152 }, { prefix: "Melo", num: 153 }, { prefix: "Mem", num: 154 },
    { prefix: "Men", num: 155 }, { prefix: "Mendes", num: 156 }, { prefix: "Mendonca", num: 157 }, { prefix: "Meo", num: 158 },
    { prefix: "Mer", num: 159 }, { prefix: "Mes", num: 161 }, { prefix: "Met", num: 162 }, { prefix: "Mev", num: 163 },
    { prefix: "Mex", num: 164 }, { prefix: "Mey", num: 165 }, { prefix: "Mez", num: 166 }, { prefix: "Mi", num: 167 },
    { prefix: "Mic", num: 168 }, { prefix: "Mid", num: 169 }, { prefix: "Mie", num: 171 }, { prefix: "Mif", num: 172 },
    { prefix: "Mig", num: 173 }, { prefix: "Mih", num: 174 }, { prefix: "Mii", num: 175 }, { prefix: "Mil", num: 176 },
    { prefix: "Mim", num: 177 }, { prefix: "Min", num: 178 }, { prefix: "Miranda", num: 179 }, { prefix: "Mio", num: 181 },
    { prefix: "Mir", num: 182 }, { prefix: "Mis", num: 183 }, { prefix: "Mit", num: 184 }, { prefix: "Miv", num: 185 },
    { prefix: "Mix", num: 186 }, { prefix: "Miy", num: 187 }, { prefix: "Miz", num: 188 }, { prefix: "Mo", num: 189 },
    { prefix: "Moc", num: 191 }, { prefix: "Mod", num: 192 }, { prefix: "Moe", num: 193 }, { prefix: "Mof", num: 194 },
    { prefix: "Mog", num: 195 }, { prefix: "Moh", num: 196 }, { prefix: "Moi", num: 197 }, { prefix: "Mol", num: 198 },
    { prefix: "Mom", num: 199 }, { prefix: "Mon", num: 211 }, { prefix: "Monteiro", num: 212 }, { prefix: "Moo", num: 213 },
    { prefix: "Mor", num: 214 }, { prefix: "Moraes", num: 215 }, { prefix: "Moreira", num: 216 }, { prefix: "Mos", num: 217 },
    { prefix: "Mot", num: 218 }, { prefix: "Moura", num: 219 }, { prefix: "Mu", num: 221 }, { prefix: "Muniz", num: 222 },
    { prefix: "N", num: 111 }, { prefix: "Na", num: 112 }, { prefix: "Nab", num: 113 }, { prefix: "Nac", num: 114 },
    { prefix: "Nad", num: 115 }, { prefix: "Nae", num: 116 }, { prefix: "Naf", num: 117 }, { prefix: "Nag", num: 118 },
    { prefix: "Nah", num: 119 }, { prefix: "Nai", num: 121 }, { prefix: "Nal", num: 122 }, { prefix: "Nam", num: 123 },
    { prefix: "Nan", num: 124 }, { prefix: "Nap", num: 125 }, { prefix: "Nar", num: 126 }, { prefix: "Nas", num: 127 },
    { prefix: "Nascimento", num: 128 }, { prefix: "Nat", num: 129 }, { prefix: "Nav", num: 131 }, { prefix: "Nax", num: 132 },
    { prefix: "Nay", num: 133 }, { prefix: "Naz", num: 134 }, { prefix: "Ne", num: 135 }, { prefix: "Nec", num: 136 },
    { prefix: "Ned", num: 137 }, { prefix: "Nee", num: 138 }, { prefix: "Nef", num: 139 }, { prefix: "Neg", num: 141 },
    { prefix: "Neh", num: 142 }, { prefix: "Nei", num: 143 }, { prefix: "Nel", num: 144 }, { prefix: "Nem", num: 145 },
    { prefix: "Nen", num: 146 }, { prefix: "Neo", num: 147 }, { prefix: "Ner", num: 148 }, { prefix: "Neri", num: 149 },
    { prefix: "Nes", num: 151 }, { prefix: "Net", num: 152 }, { prefix: "Neto", num: 153 }, { prefix: "Nev", num: 154 },
    { prefix: "Neves", num: 155 }, { prefix: "Nex", num: 156 }, { prefix: "Ney", num: 157 }, { prefix: "Nez", num: 158 },
    { prefix: "Ni", num: 159 }, { prefix: "Nic", num: 161 }, { prefix: "Nid", num: 162 }, { prefix: "Nie", num: 163 },
    { prefix: "Nif", num: 164 }, { prefix: "Nig", num: 165 }, { prefix: "Nih", num: 166 }, { prefix: "Nii", num: 167 },
    { prefix: "Nil", num: 168 }, { prefix: "Nim", num: 169 }, { prefix: "Nin", num: 171 }, { prefix: "Nio", num: 172 },
    { prefix: "Nir", num: 173 }, { prefix: "Nis", num: 174 }, { prefix: "Nit", num: 175 }, { prefix: "Niv", num: 176 },
    { prefix: "Nix", num: 177 }, { prefix: "Niy", num: 178 }, { prefix: "Niz", num: 179 }, { prefix: "No", num: 181 },
    { prefix: "Noc", num: 182 }, { prefix: "Nod", num: 183 }, { prefix: "Noe", num: 184 }, { prefix: "Nof", num: 185 },
    { prefix: "Nog", num: 186 }, { prefix: "Nogueira", num: 187 }, { prefix: "Noh", num: 188 }, { prefix: "Noi", num: 189 },
    { prefix: "Nol", num: 191 }, { prefix: "Nom", num: 192 }, { prefix: "Non", num: 193 }, { prefix: "Noo", num: 194 },
    { prefix: "Nor", num: 195 }, { prefix: "Nos", num: 196 }, { prefix: "Not", num: 197 }, { prefix: "Novaes", num: 198 },
    { prefix: "Nov", num: 199 }, { prefix: "Nox", num: 211 }, { prefix: "Noy", num: 212 }, { prefix: "Noz", num: 213 },
    { prefix: "Nu", num: 214 }, { prefix: "Nunes", num: 215 },
    { prefix: "O", num: 111 }, { prefix: "Ob", num: 112 }, { prefix: "Oc", num: 113 }, { prefix: "Od", num: 114 },
    { prefix: "Oe", num: 115 }, { prefix: "Of", num: 116 }, { prefix: "Og", num: 117 }, { prefix: "Oh", num: 118 },
    { prefix: "Oi", num: 119 }, { prefix: "Oj", num: 121 }, { prefix: "Ok", num: 122 }, { prefix: "Ol", num: 123 },
    { prefix: "Oliveira", num: 124 }, { prefix: "Om", num: 125 }, { prefix: "On", num: 126 }, { prefix: "Op", num: 127 },
    { prefix: "Oq", num: 128 }, { prefix: "Or", num: 129 }, { prefix: "Os", num: 131 }, { prefix: "Ot", num: 132 },
    { prefix: "Ou", num: 133 }, { prefix: "Ov", num: 134 }, { prefix: "Ow", num: 135 }, { prefix: "Ox", num: 136 },
    { prefix: "Oy", num: 137 }, { prefix: "Oz", num: 138 },
    { prefix: "P", num: 111 }, { prefix: "Pa", num: 112 }, { prefix: "Pab", num: 113 }, { prefix: "Pac", num: 114 },
    { prefix: "Pacheco", num: 115 }, { prefix: "Pad", num: 116 }, { prefix: "Pae", num: 117 }, { prefix: "Paf", num: 118 },
    { prefix: "Pag", num: 119 }, { prefix: "Pah", num: 121 }, { prefix: "Pai", num: 122 }, { prefix: "Paiva", num: 123 },
    { prefix: "Pal", num: 124 }, { prefix: "Pam", num: 125 }, { prefix: "Pan", num: 126 }, { prefix: "Pap", num: 127 },
    { prefix: "Par", num: 128 }, { prefix: "Pas", num: 129 }, { prefix: "Pat", num: 131 }, { prefix: "Pau", num: 132 },
    { prefix: "Paula", num: 133 }, { prefix: "Pav", num: 134 }, { prefix: "Pax", num: 135 }, { prefix: "Pay", num: 136 },
    { prefix: "Paz", num: 137 }, { prefix: "Pe", num: 138 }, { prefix: "Pec", num: 139 }, { prefix: "Ped", num: 141 },
    { prefix: "Pee", num: 142 }, { prefix: "Pef", num: 143 }, { prefix: "Peg", num: 144 }, { prefix: "Peh", num: 145 },
    { prefix: "Pei", num: 146 }, { prefix: "Peixoto", num: 147 }, { prefix: "Pel", num: 148 }, { prefix: "Pem", num: 149 },
    { prefix: "Pen", num: 151 }, { prefix: "Pena", num: 152 }, { prefix: "Peo", num: 153 }, { prefix: "Per", num: 154 },
    { prefix: "Pereira", num: 155 }, { prefix: "Pes", num: 156 }, { prefix: "Pet", num: 157 }, { prefix: "Pev", num: 158 },
    { prefix: "Pex", num: 159 }, { prefix: "Pey", num: 161 }, { prefix: "Pez", num: 162 }, { prefix: "Pi", num: 163 },
    { prefix: "Pic", num: 164 }, { prefix: "Pid", num: 165 }, { prefix: "Pie", num: 166 }, { prefix: "Pif", num: 167 },
    { prefix: "Pig", num: 168 }, { prefix: "Pih", num: 169 }, { prefix: "Pii", num: 171 }, { prefix: "Pil", num: 172 },
    { prefix: "Pim", num: 173 }, { prefix: "Pimenta", num: 174 }, { prefix: "Pin", num: 175 }, { prefix: "Pinheiro", num: 176 },
    { prefix: "Pinto", num: 177 }, { prefix: "Pio", num: 178 }, { prefix: "Pir", num: 179 }, { prefix: "Pires", num: 181 },
    { prefix: "Pis", num: 182 }, { prefix: "Pit", num: 183 }, { prefix: "Piv", num: 184 }, { prefix: "Pix", num: 185 },
    { prefix: "Piy", num: 186 }, { prefix: "Piz", num: 187 }, { prefix: "Pl", num: 188 }, { prefix: "Po", num: 189 },
    { prefix: "Poc", num: 191 }, { prefix: "Pod", num: 192 }, { prefix: "Poe", num: 193 }, { prefix: "Pof", num: 194 },
    { prefix: "Pog", num: 195 }, { prefix: "Poh", num: 196 }, { prefix: "Poi", num: 197 }, { prefix: "Pol", num: 198 },
    { prefix: "Pom", num: 199 }, { prefix: "Pon", num: 211 }, { prefix: "Poo", num: 212 }, { prefix: "Por", num: 213 },
    { prefix: "Porto", num: 214 }, { prefix: "Pos", num: 215 }, { prefix: "Pot", num: 216 }, { prefix: "Pov", num: 217 },
    { prefix: "Pr", num: 218 }, { prefix: "Prado", num: 219 }, { prefix: "Q", num: 221 }, { prefix: "Queiroz", num: 222 },
    { prefix: "R", num: 111 }, { prefix: "Ra", num: 112 }, { prefix: "Rab", num: 113 }, { prefix: "Rac", num: 114 },
    { prefix: "Rad", num: 115 }, { prefix: "Rae", num: 116 }, { prefix: "Raf", num: 117 }, { prefix: "Rag", num: 118 },
    { prefix: "Rah", num: 119 }, { prefix: "Rai", num: 121 }, { prefix: "Ral", num: 122 }, { prefix: "Ram", num: 123 },
    { prefix: "Ramos", num: 124 }, { prefix: "Ran", num: 125 }, { prefix: "Rap", num: 126 }, { prefix: "Rar", num: 127 },
    { prefix: "Ras", num: 128 }, { prefix: "Rat", num: 129 }, { prefix: "Rav", num: 131 }, { prefix: "Rax", num: 132 },
    { prefix: "Ray", num: 133 }, { prefix: "Raz", num: 134 }, { prefix: "Re", num: 135 }, { prefix: "Rec", num: 136 },
    { prefix: "Red", num: 137 }, { prefix: "Ree", num: 138 }, { prefix: "Ref", num: 139 }, { prefix: "Reg", num: 141 },
    { prefix: "Rego", num: 142 }, { prefix: "Reh", num: 143 }, { prefix: "Rei", num: 144 }, { prefix: "Reis", num: 145 },
    { prefix: "Rel", num: 146 }, { prefix: "Rem", num: 147 }, { prefix: "Ren", num: 148 }, { prefix: "Reo", num: 149 },
    { prefix: "Rer", num: 151 }, { prefix: "Res", num: 152 }, { prefix: "Ret", num: 153 }, { prefix: "Rev", num: 154 },
    { prefix: "Rex", num: 155 }, { prefix: "Rey", num: 156 }, { prefix: "Rez", num: 157 }, { prefix: "Rezende", num: 158 },
    { prefix: "Ri", num: 159 }, { prefix: "Rib", num: 161 }, { prefix: "Ribeiro", num: 162 }, { prefix: "Ric", num: 163 },
    { prefix: "Rid", num: 164 }, { prefix: "Rie", num: 165 }, { prefix: "Rif", num: 166 }, { prefix: "Rig", num: 167 },
    { prefix: "Rih", num: 168 }, { prefix: "Rii", num: 169 }, { prefix: "Ril", num: 171 }, { prefix: "Rim", num: 172 },
    { prefix: "Rin", num: 173 }, { prefix: "Rio", num: 174 }, { prefix: "Rios", num: 175 }, { prefix: "Rir", num: 176 },
    { prefix: "Ris", num: 177 }, { prefix: "Rit", num: 178 }, { prefix: "Riv", num: 179 }, { prefix: "Rix", num: 181 },
    { prefix: "Riy", num: 182 }, { prefix: "Riz", num: 183 }, { prefix: "Ro", num: 184 }, { prefix: "Roc", num: 185 },
    { prefix: "Rocha", num: 186 }, { prefix: "Rod", num: 187 }, { prefix: "Rodrigues", num: 188 }, { prefix: "Roe", num: 189 },
    { prefix: "Rof", num: 191 }, { prefix: "Rog", num: 192 }, { prefix: "Roh", num: 193 }, { prefix: "Roi", num: 194 },
    { prefix: "Rol", num: 195 }, { prefix: "Rom", num: 196 }, { prefix: "Ron", num: 197 }, { prefix: "Roo", num: 198 },
    { prefix: "Ror", num: 199 }, { prefix: "Ros", num: 211 }, { prefix: "Rosa", num: 212 }, { prefix: "Rot", num: 213 },
    { prefix: "Rov", num: 214 }, { prefix: "Rox", num: 215 }, { prefix: "Roy", num: 216 }, { prefix: "Roz", num: 217 },
    { prefix: "Ru", num: 218 }, { prefix: "Ribeiro", num: 219 }, { prefix: "Rocha", num: 221 }, { prefix: "Ruiz", num: 222 },
    { prefix: "S", num: 111 }, { prefix: "Sa", num: 112 }, { prefix: "Sab", num: 113 }, { prefix: "Sac", num: 114 },
    { prefix: "Sad", num: 115 }, { prefix: "Sae", num: 116 }, { prefix: "Saf", num: 117 }, { prefix: "Sag", num: 118 },
    { prefix: "Sah", num: 119 }, { prefix: "Sai", num: 121 }, { prefix: "Sal", num: 122 }, { prefix: "Sales", num: 123 },
    { prefix: "Sam", num: 124 }, { prefix: "Sampaio", num: 125 }, { prefix: "San", num: 126 }, { prefix: "Sant", num: 127 },
    { prefix: "Santana", num: 128 }, { prefix: "Santiago", num: 129 }, { prefix: "Santos", num: 131 }, { prefix: "Sao", num: 132 },
    { prefix: "Sap", num: 133 }, { prefix: "Sar", num: 134 }, { prefix: "Sas", num: 135 }, { prefix: "Sat", num: 136 },
    { prefix: "Sau", num: 137 }, { prefix: "Sav", num: 138 }, { prefix: "Sax", num: 139 }, { prefix: "Say", num: 141 },
    { prefix: "Saz", num: 142 }, { prefix: "Sc", num: 143 }, { prefix: "Sch", num: 144 }, { prefix: "Se", num: 145 },
    { prefix: "Sec", num: 146 }, { prefix: "Sed", num: 147 }, { prefix: "See", num: 148 }, { prefix: "Sef", num: 149 },
    { prefix: "Seg", num: 151 }, { prefix: "Seh", num: 152 }, { prefix: "Sei", num: 153 }, { prefix: "Sel", num: 154 },
    { prefix: "Sem", num: 155 }, { prefix: "Sen", num: 156 }, { prefix: "Sena", num: 157 }, { prefix: "Seo", num: 158 },
    { prefix: "Ser", num: 159 }, { prefix: "Ses", num: 161 }, { prefix: "Set", num: 162 }, { prefix: "Sev", num: 163 },
    { prefix: "Sex", num: 164 }, { prefix: "Sey", num: 165 }, { prefix: "Sez", num: 166 }, { prefix: "Si", num: 167 },
    { prefix: "Sic", num: 168 }, { prefix: "Sid", num: 169 }, { prefix: "Sie", num: 171 }, { prefix: "Sif", num: 172 },
    { prefix: "Sig", num: 173 }, { prefix: "Sih", num: 174 }, { prefix: "Sii", num: 175 }, { prefix: "Sil", num: 176 },
    { prefix: "Silva", num: 177 }, { prefix: "Sim", num: 178 }, { prefix: "Simoes", num: 179 }, { prefix: "Sin", num: 181 },
    { prefix: "Sio", num: 182 }, { prefix: "Sir", num: 183 }, { prefix: "Sis", num: 184 }, { prefix: "Sit", num: 185 },
    { prefix: "Siv", num: 186 }, { prefix: "Six", num: 187 }, { prefix: "Siy", num: 188 }, { prefix: "Siz", num: 189 },
    { prefix: "So", num: 191 }, { prefix: "Soc", num: 192 }, { prefix: "Sod", num: 193 }, { prefix: "Soe", num: 194 },
    { prefix: "Sof", num: 195 }, { prefix: "Sog", num: 196 }, { prefix: "Soh", num: 197 }, { prefix: "Soi", num: 198 },
    { prefix: "Sol", num: 199 }, { prefix: "Som", num: 211 }, { prefix: "Son", num: 212 }, { prefix: "Soo", num: 213 },
    { prefix: "Sor", num: 214 }, { prefix: "Sos", num: 215 }, { prefix: "Sot", num: 216 }, { prefix: "Sou", num: 217 },
    { prefix: "Sousa", num: 218 }, { prefix: "Souza", num: 219 }, { prefix: "Sp", num: 221 }, { prefix: "St", num: 222 },
    { prefix: "Su", num: 223 }, { prefix: "Sy", num: 224 },
    { prefix: "T", num: 111 }, { prefix: "Ta", num: 112 }, { prefix: "Tab", num: 113 }, { prefix: "Tac", num: 114 },
    { prefix: "Tad", num: 115 }, { prefix: "Tae", num: 116 }, { prefix: "Taf", num: 117 }, { prefix: "Tag", num: 118 },
    { prefix: "Tah", num: 119 }, { prefix: "Tai", num: 121 }, { prefix: "Tal", num: 122 }, { prefix: "Tam", num: 123 },
    { prefix: "Tan", num: 124 }, { prefix: "Tap", num: 125 }, { prefix: "Tar", num: 126 }, { prefix: "Tas", num: 127 },
    { prefix: "Tat", num: 128 }, { prefix: "Tau", num: 129 }, { prefix: "Tav", num: 131 }, { prefix: "Tavares", num: 132 },
    { prefix: "Tax", num: 133 }, { prefix: "Tay", num: 134 }, { prefix: "Taz", num: 135 }, { prefix: "Te", num: 136 },
    { prefix: "Tec", num: 137 }, { prefix: "Ted", num: 138 }, { prefix: "Tee", num: 139 }, { prefix: "Tef", num: 141 },
    { prefix: "Teg", num: 142 }, { prefix: "Teh", num: 143 }, { prefix: "Tei", num: 144 }, { prefix: "Teixeira", num: 145 },
    { prefix: "Tel", num: 146 }, { prefix: "Tem", num: 147 }, { prefix: "Ten", num: 148 }, { prefix: "Teo", num: 149 },
    { prefix: "Ter", num: 151 }, { prefix: "Tes", num: 152 }, { prefix: "Tet", num: 153 }, { prefix: "Tev", num: 154 },
    { prefix: "Tex", num: 155 }, { prefix: "Tey", num: 156 }, { prefix: "Tez", num: 157 }, { prefix: "Th", num: 158 },
    { prefix: "Ti", num: 159 }, { prefix: "Tic", num: 161 }, { prefix: "Tid", num: 162 }, { prefix: "Tie", num: 163 },
    { prefix: "Tif", num: 164 }, { prefix: "Tig", num: 165 }, { prefix: "Tih", num: 166 }, { prefix: "Tii", num: 167 },
    { prefix: "Til", num: 168 }, { prefix: "Tim", num: 169 }, { prefix: "Tin", num: 171 }, { prefix: "Tio", num: 172 },
    { prefix: "Tir", num: 173 }, { prefix: "Tis", num: 174 }, { prefix: "Tit", num: 175 }, { prefix: "Tiv", num: 176 },
    { prefix: "Tix", num: 177 }, { prefix: "Tiy", num: 178 }, { prefix: "Tiz", num: 179 }, { prefix: "To", num: 181 },
    { prefix: "Toc", num: 182 }, { prefix: "Tod", num: 183 }, { prefix: "Toe", num: 184 }, { prefix: "Tof", num: 185 },
    { prefix: "Tog", num: 186 }, { prefix: "Toh", num: 187 }, { prefix: "Toi", num: 188 }, { prefix: "Tol", num: 189 },
    { prefix: "Toledo", num: 191 }, { prefix: "Tom", num: 192 }, { prefix: "Ton", num: 193 }, { prefix: "Too", num: 194 },
    { prefix: "Tor", num: 195 }, { prefix: "Torres", num: 196 }, { prefix: "Tos", num: 197 }, { prefix: "Tot", num: 198 },
    { prefix: "Tov", num: 199 }, { prefix: "Tr", num: 211 }, { prefix: "Tu", num: 212 }, { prefix: "Ty", num: 213 },
    { prefix: "U", num: 111 }, { prefix: "V", num: 111 }, { prefix: "Va", num: 112 }, { prefix: "Val", num: 113 },
    { prefix: "Vaz", num: 114 }, { prefix: "Ve", num: 115 }, { prefix: "Vi", num: 116 }, { prefix: "Viana", num: 117 },
    { prefix: "Vic", num: 118 }, { prefix: "Vid", num: 119 }, { prefix: "Vie", num: 121 }, { prefix: "Vieira", num: 122 },
    { prefix: "Vil", num: 123 }, { prefix: "Vila", num: 124 }, { prefix: "Vin", num: 125 }, { prefix: "Vit", num: 126 },
    { prefix: "W", num: 111 }, { prefix: "X", num: 111 }, { prefix: "Y", num: 111 }, { prefix: "Z", num: 111 }
];

// Otimização: ordenar do maior prefixo para o menor para buscar pela correspondência mais longa
cutterMap.sort((a, b) => b.prefix.length - a.prefix.length);

window.calculateCutter = function(baseText, mainEntryType, titleText) {
    if (!baseText) return '';
    
    let cleanBase = baseText.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
    
    if (mainEntryType === 'title') {
        // Ignorar artigos iniciais se a entrada for pelo título
        let words = cleanBase.split(' ').filter(w => w.length > 0);
        let firstTitleWord = words[0] || 'A';
        const artigos = ['O', 'A', 'OS', 'AS', 'UM', 'UMA', 'UNS', 'UMAS', 'THE', 'AN'];
        
        if (artigos.includes(firstTitleWord) && words.length > 1) {
            firstTitleWord = words[1];
        }
        cleanBase = firstTitleWord;
    }

    if (!cleanBase) return '';

    let num = null;
    let matchFound = null;

    for (let i = 0; i < cutterMap.length; i++) {
        let p = cutterMap[i].prefix.toUpperCase();
        if (cleanBase.startsWith(p)) {
            num = cutterMap[i].num;
            matchFound = p;
            break;
        }
    }

    // Fallback: se não achar mapeamento perfeito, pega a primeira letra.
    if (!num) {
        num = 111; 
    }

    let firstLetter = cleanBase.charAt(0);
    let finalLetter = 'a'; // Padrão
    
    if (mainEntryType === 'author') {
        if (titleText) {
            let cleanTitle = titleText.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            let words = cleanTitle.split(' ').filter(w => w.length > 0);
            let firstTitleWord = words[0] || 'a';
            const artigos = ['o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas', 'the', 'an'];
            if (artigos.includes(firstTitleWord) && words.length > 1) {
                firstTitleWord = words[1];
            }
            finalLetter = firstTitleWord.charAt(0);
        }
    } else if (mainEntryType === 'title') {
        // Para entrada por título, a letra final é a inicial da próxima palavra (se houver)
        let words = baseText.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().split(' ').filter(w => w.length > 0);
        let validWords = [];
        const artigos = ['o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas'];
        
        // Remove artigos apenas da primeira posição
        if (words.length > 0 && artigos.includes(words[0])) {
            words.shift();
        }
        
        if (words.length > 1) {
            finalLetter = words[1].charAt(0);
        } else {
            // Se o título tiver só uma palavra, não há segunda letra para por
            finalLetter = '';
        }
    }

    return `${firstLetter}${num}${finalLetter}`;
};
