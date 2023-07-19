import codecs

s = '<c>Cnegvpvcngvba va ebnq genssvp erdhverf pbafgnag pnhgvba naq zhghny erfcrpg. Gurersber, qrsrafvir qeviref rkcrpg bgure ebnq hfref gb znxr zvfgnxrf.<\/c>\r\n<c>Va nqqvgvba, qrsrafvir qeviref ner cercnerq abg gb vafvfg ba gurve evtugf va beqre gb erfbyir qnatrebhf fvghngvbaf.<\/c>'
sd = codecs.decode(s, 'rot_13')

s = 'Who can be held responsible if the toll charge is not paid?'
sd = codecs.encode(s, 'rot_13')
print(sd)
