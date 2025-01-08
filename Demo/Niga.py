'''
         '
        '
      (')
      | |
      | |
      | |
      | |
     O   O
     
     4
6
2
2
3
3
4
4
'''
a = input()
b = int(input())
c = []
d=1
for i in range(b):
    c.append(input())
c.sort(reverse=True)
b=c[0]
for i in c:
    if i < b:
        b=i
        d+=1
   
print(d)
